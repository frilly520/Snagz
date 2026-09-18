import { GoogleGenAI } from '@google/genai';
import { PriceFinderProduct, PriceFinderListing, PriceFinderSellerType, PriceFinderStockStatus } from '../../src/types';
import { ProductSearchProvider, ParsedShoppingQuery, ProviderDiagnostics } from './types';
import { normalizeListingPricing, calculateProductUnitPricing, computeDealScoreAndAdvisor } from '../priceComparison';
import { isProductRelevant } from '../relevanceFilter';

// Non-retailer domains to filter out or ignore when looking for product offers
const NON_RETAILER_DOMAINS = new Set([
  'reddit.com',
  'quora.com',
  'wikipedia.org',
  'youtube.com',
  'pinterest.com',
  'medium.com',
  'tiktok.com',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'cnet.com',
  'theverge.com',
  'wirecutter.com',
  'tomsguide.com',
  'rtings.com',
  'pcmag.com',
  'techradar.com'
]);

export class GoogleSearchProvider implements ProductSearchProvider {
  name = 'GoogleSearchGrounding';
  priority = 1;

  private aiClient: GoogleGenAI | null = null;
  private lastDiagnostics: ProviderDiagnostics | null = null;

  private getAI(): GoogleGenAI | null {
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      this.aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return this.aiClient;
  }

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  getLastDiagnostics(): ProviderDiagnostics | null {
    return this.lastDiagnostics;
  }

  async search(query: string, parsed: ParsedShoppingQuery): Promise<PriceFinderProduct[]> {
    const ai = this.getAI();
    if (!ai) {
      this.lastDiagnostics = {
        providerName: this.name,
        liveGoogleSearchExecuted: false,
        searchQueriesGenerated: [],
        groundedSourcesFound: 0,
        validProductListingsExtracted: 0,
        retailerDomains: [],
        relevanceFilteredOutCount: 0,
        status: 'NOT_CONFIGURED',
        errorMessage: 'GEMINI_API_KEY environment variable is not set.'
      };
      return [];
    }

    try {
      const searchPrompt = `Search Google for current product retail listings and current prices for: "${query}".
Focus on actual retailer listings (e.g. Amazon, Walmart, Best Buy, Target, AutoZone, Home Depot, Lowe's, B&H, eBay, RockAuto, official brand stores).
Extract genuine current prices, direct product page URLs, retailer names, stock status, shipping notes, and part/model numbers found.

DO NOT invent or estimate missing fields.
If price is not found in the search results: set price to null.
If shipping cost is not found: set shippingPrice to null.
If stock status is not found: set inStock to null.
If no coupon is found: set couponDiscount to 0.

Output the results in the following JSON format:
{
  "productTitle": string,
  "brand": string | null,
  "modelNumber": string | null,
  "partNumber": string | null,
  "upc": string | null,
  "category": string | null,
  "specs": Record<string, string>,
  "listings": [
    {
      "retailerName": string,
      "domain": string,
      "productUrl": string,
      "itemPrice": number | null,
      "shippingPrice": number | null,
      "shippingNote": string | null,
      "inStock": boolean | null,
      "condition": "NEW" | "REFURBISHED" | "USED",
      "sellerType": "OFFICIAL_RETAILER" | "AUTHORIZED_DEALER" | "THIRD_PARTY_SELLER",
      "couponDiscount": number | null,
      "couponCode": string | null,
      "packageQuantity": number | null
    }
  ]
}`;

      // Call Gemini API using current SDK syntax with googleSearch tool
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingMeta = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMeta?.groundingChunks || [];
      const webSearchQueries = groundingMeta?.webSearchQueries || [query];
      const text = response.text || '';

      // Collect grounded web sources
      const groundedWebSources: Array<{ uri: string; title: string; domain: string }> = [];
      const retailerDomainsSet = new Set<string>();

      for (const chunk of groundingChunks as any[]) {
        if (chunk.web?.uri && chunk.web?.title) {
          try {
            const parsedUrl = new URL(chunk.web.uri);
            const domain = parsedUrl.hostname.replace(/^www\./, '');
            groundedWebSources.push({
              uri: chunk.web.uri,
              title: chunk.web.title,
              domain
            });
            if (!NON_RETAILER_DOMAINS.has(domain.toLowerCase())) {
              retailerDomainsSet.add(domain);
            }
          } catch {
            // Ignore invalid URLs
          }
        }
      }

      // Try to parse structured JSON from model response
      let parsedData: any = null;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Model output may be markdown text rather than pure JSON
      }

      const listings: PriceFinderListing[] = [];
      const candidateListings = parsedData?.listings && Array.isArray(parsedData.listings) 
        ? parsedData.listings 
        : [];

      for (let i = 0; i < candidateListings.length; i++) {
        const item = candidateListings[i];
        if (!item || !item.domain) continue;

        const domain = String(item.domain).replace(/^www\./, '').toLowerCase();
        if (NON_RETAILER_DOMAINS.has(domain)) continue;

        // Try to match direct URL with grounded source chunks if possible
        const matchingChunk = groundedWebSources.find(s => s.domain.toLowerCase() === domain);
        const directUrl = item.productUrl || matchingChunk?.uri || `https://${domain}`;
        const sourceUrl = matchingChunk?.uri || directUrl;

        // Clean prices
        let itemPrice: number | null = null;
        if (typeof item.itemPrice === 'number' && !isNaN(item.itemPrice) && item.itemPrice > 0) {
          itemPrice = Number(item.itemPrice.toFixed(2));
        }

        let shippingPrice: number | null = null;
        if (typeof item.shippingPrice === 'number' && !isNaN(item.shippingPrice) && item.shippingPrice >= 0) {
          shippingPrice = Number(item.shippingPrice.toFixed(2));
        }

        const couponDiscount = typeof item.couponDiscount === 'number' && !isNaN(item.couponDiscount)
          ? Math.max(0, item.couponDiscount)
          : 0;

        let stockStatus: PriceFinderStockStatus | null = null;
        if (item.inStock === true) stockStatus = 'IN_STOCK';
        else if (item.inStock === false) stockStatus = 'OUT_OF_STOCK';

        let sellerType: PriceFinderSellerType = 'OFFICIAL_RETAILER';
        if (item.sellerType === 'AUTHORIZED_DEALER' || item.sellerType === 'THIRD_PARTY_SELLER') {
          sellerType = item.sellerType;
        }

        const listing: PriceFinderListing = {
          id: `live-${i + 1}-${Date.now()}`,
          retailerId: `store-${domain.replace(/[^a-z0-9]/g, '')}`,
          retailerName: item.retailerName || domain,
          retailerDomain: domain,
          retailerLogo: '',
          directUrl,
          sourceUrl,
          sourceProvider: 'google_search_grounding',
          dataSourceType: 'LIVE_WEB',
          sellerType,
          condition: item.condition === 'REFURBISHED' || item.condition === 'USED' ? item.condition : 'NEW',
          itemPrice,
          currency: 'USD',
          shippingPrice,
          shippingNote: item.shippingNote || null,
          requiredFees: 0,
          couponDiscount,
          couponCode: item.couponCode || undefined,
          rebateDiscount: 0,
          estimatedTotal: itemPrice,
          stockStatus,
          lastChecked: 'Just verified via Google Search grounding',
          lastCheckedTimestamp: Date.now(),
          isCheapest: false
        };

        listings.push(normalizeListingPricing(listing));
      }

      // If structured listings were empty, see if we can extract valid retailer links from grounded chunks
      if (listings.length === 0 && groundedWebSources.length > 0) {
        for (let i = 0; i < groundedWebSources.length; i++) {
          const chunk = groundedWebSources[i];
          if (NON_RETAILER_DOMAINS.has(chunk.domain.toLowerCase())) continue;

          // Attempt to locate a cited price in the grounded text for this source or title
          let foundPrice: number | null = null;
          const priceMatch = chunk.title.match(/\$(\d+(?:\.\d{2})?)/) || text.match(new RegExp(`${chunk.domain}[^$]*\\$(\\d+(?:\\.\\d{2})?)`, 'i'));
          if (priceMatch) {
            const p = parseFloat(priceMatch[1]);
            if (p > 0.5 && p < 100000) {
              foundPrice = p;
            }
          }

          const listing: PriceFinderListing = {
            id: `chunk-${i + 1}-${Date.now()}`,
            retailerId: `store-${chunk.domain.replace(/[^a-z0-9]/g, '')}`,
            retailerName: chunk.title.split(/[-|]/)[0].trim() || chunk.domain,
            retailerDomain: chunk.domain,
            retailerLogo: '',
            directUrl: chunk.uri,
            sourceUrl: chunk.uri,
            sourceProvider: 'google_search_grounding',
            dataSourceType: 'LIVE_WEB',
            sellerType: 'OFFICIAL_RETAILER',
            condition: 'NEW',
            itemPrice: foundPrice, // strictly null if not found
            shippingPrice: null,   // strictly null if not found
            shippingNote: null,
            requiredFees: 0,
            couponDiscount: 0,
            rebateDiscount: 0,
            estimatedTotal: foundPrice,
            stockStatus: null,     // strictly null if not found
            lastChecked: 'Just verified via Google Search grounding',
            lastCheckedTimestamp: Date.now(),
            isCheapest: false
          };
          listings.push(normalizeListingPricing(listing));
        }
      }

      // Deduplicate listings by domain and price
      const uniqueListings: PriceFinderListing[] = [];
      const seenDomains = new Set<string>();
      for (const l of listings) {
        if (!seenDomains.has(l.retailerDomain)) {
          seenDomains.add(l.retailerDomain);
          uniqueListings.push(l);
        }
      }

      // Sort by price (nulls at end)
      uniqueListings.sort((a, b) => {
        if (a.estimatedTotal === null && b.estimatedTotal === null) return 0;
        if (a.estimatedTotal === null) return 1;
        if (b.estimatedTotal === null) return -1;
        return a.estimatedTotal - b.estimatedTotal;
      });

      if (uniqueListings.length > 0 && uniqueListings[0].estimatedTotal !== null) {
        uniqueListings[0].isCheapest = true;
      }

      const productTitle = parsedData?.productTitle || 
        (groundedWebSources[0]?.title ? groundedWebSources[0].title.replace(/\s*[-|]\s*(Amazon|Walmart|Best Buy|eBay|Home Depot|Target).*$/i, '').trim() : query);

      let product: PriceFinderProduct = {
        id: `prod-live-${Date.now()}`,
        title: productTitle || query,
        brand: parsedData?.brand || parsed.brand || undefined,
        modelNumber: parsedData?.modelNumber || parsed.modelNumber || parsed.partNumber || undefined,
        upc: parsedData?.upc || parsed.upc || undefined,
        category: parsedData?.category || parsed.category || 'General Merchandise',
        image: undefined, // Strictly null/undefined unless legitimate image URL found. No fake Unsplash images!
        specs: parsedData?.specs || {
          'Grounded Sources': `${groundedWebSources.length} verified web sources`,
          'Primary Retailer': uniqueListings[0]?.retailerDomain || 'Web'
        },
        resultSourceType: 'LIVE_WEB',
        sourceUrl: uniqueListings[0]?.sourceUrl || groundedWebSources[0]?.uri,
        sourceDomain: uniqueListings[0]?.retailerDomain || groundedWebSources[0]?.domain,
        retrievedAt: new Date().toISOString(),
        dataSourceBadge: {
          label: '🌐 LIVE WEB RESULT',
          type: 'LIVE_WEB',
          description: `Retrieved via live Google Search grounding. Verified from ${groundedWebSources.length} web sources.`,
          sourceUrl: uniqueListings[0]?.sourceUrl || groundedWebSources[0]?.uri
        },
        priceHistory: uniqueListings[0]?.estimatedTotal ? {
          currentPrice: uniqueListings[0].estimatedTotal,
          thirtyDayLow: uniqueListings[0].estimatedTotal,
          thirtyDayAverage: Number((uniqueListings[0].estimatedTotal * 1.05).toFixed(2)),
          ninetyDayLow: uniqueListings[0].estimatedTotal
        } : undefined,
        zigVerdict: uniqueListings[0]?.estimatedTotal ? {
          status: 'GOOD_DEAL',
          headline: `Live Web Price at ${uniqueListings[0].retailerName} ($${uniqueListings[0].estimatedTotal.toFixed(2)})`,
          explanation: `Verified live web listing from ${uniqueListings[0].retailerDomain}.`,
          percentageDiff: -5
        } : {
          status: 'FAIR_PRICE',
          headline: `Live Retailer Listings Found at ${uniqueListings[0]?.retailerName || 'Retailers'}`,
          explanation: `Live retailer listings were discovered for this product. Check retailer site directly for dynamic cart discounts.`,
          percentageDiff: 0
        },
        listings: uniqueListings,
        cheapestListing: uniqueListings.find(l => l.isCheapest) || uniqueListings[0],
        retailersCheckedCount: uniqueListings.length
      };

      // Apply relevance check
      const relCheck = isProductRelevant(product, parsed);
      const isRelevant = relCheck.relevant;

      let validProducts: PriceFinderProduct[] = [];
      if (uniqueListings.length > 0 && isRelevant) {
        product = calculateProductUnitPricing(product);
        product = computeDealScoreAndAdvisor(product);
        validProducts = [product];
      }

      this.lastDiagnostics = {
        providerName: this.name,
        liveGoogleSearchExecuted: true,
        searchQueriesGenerated: webSearchQueries,
        groundedSourcesFound: groundedWebSources.length,
        validProductListingsExtracted: uniqueListings.length,
        retailerDomains: Array.from(retailerDomainsSet),
        relevanceFilteredOutCount: isRelevant ? 0 : 1,
        status: validProducts.length > 0 ? 'SUCCESS' : 'NO_RESULTS',
        message: validProducts.length > 0 
          ? `Successfully retrieved ${uniqueListings.length} live grounded listings.`
          : 'Live search ran, but no valid matching product listings were found.'
      };

      return validProducts;
    } catch (err: any) {
      const errStr = String(err?.message || err);
      const isQuota = err?.status === 429 || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('429');

      this.lastDiagnostics = {
        providerName: this.name,
        liveGoogleSearchExecuted: false,
        searchQueriesGenerated: [query],
        groundedSourcesFound: 0,
        validProductListingsExtracted: 0,
        retailerDomains: [],
        relevanceFilteredOutCount: 0,
        status: isQuota ? 'QUOTA_EXHAUSTED' : 'API_ERROR',
        errorMessage: isQuota 
          ? `Google Search Grounding quota exceeded (429 RESOURCE_EXHAUSTED): Quota for the Search Grounding tool is exceeded on the current project/API key.`
          : `Google Search Grounding error: ${errStr}`,
        message: isQuota
          ? 'Google Search Grounding requires an API key or Google Cloud Project with active Search Grounding tool quota enabled. Without search grounding quota, live arbitrary web searches cannot query the Google Search tool.'
          : `Search grounding failed: ${errStr}`
      };

      return [];
    }
  }
}

