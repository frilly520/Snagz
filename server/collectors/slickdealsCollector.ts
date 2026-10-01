import { parseRssFeed } from './xmlParser';
import { CollectorResult, RawDiscoveredDeal, RawDiscoveredCoupon } from './types';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const RETAILER_MAPPINGS: { pattern: RegExp; id: string; name: string; domain: string; logo: string }[] = [
  {
    pattern: /\b(amazon|prime)\b/i,
    id: 'store-amazon',
    name: 'Amazon',
    domain: 'amazon.com',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bwalmart\b/i,
    id: 'store-walmart',
    name: 'Walmart',
    domain: 'walmart.com',
    logo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\btarget\b/i,
    id: 'store-target',
    name: 'Target',
    domain: 'target.com',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bbest\s*buy\b/i,
    id: 'store-bestbuy',
    name: 'Best Buy',
    domain: 'bestbuy.com',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bhome\s*depot\b/i,
    id: 'store-homedepot',
    name: 'The Home Depot',
    domain: 'homedepot.com',
    logo: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bcostco\b/i,
    id: 'store-costco',
    name: 'Costco',
    domain: 'costco.com',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bcvs\b/i,
    id: 'store-cvs',
    name: 'CVS Pharmacy',
    domain: 'cvs.com',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bwalgreens\b/i,
    id: 'store-walgreens',
    name: 'Walgreens',
    domain: 'walgreens.com',
    logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bdollar\s*general\b/i,
    id: 'store-dollargeneral',
    name: 'Dollar General',
    domain: 'dollargeneral.com',
    logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bsamsung\b/i,
    id: 'store-samsung',
    name: 'Samsung',
    domain: 'samsung.com',
    logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bdell\b/i,
    id: 'store-dell',
    name: 'Dell',
    domain: 'dell.com',
    logo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    pattern: /\bnike\b/i,
    id: 'store-nike',
    name: 'Nike',
    domain: 'nike.com',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80'
  }
];

export async function fetchSlickdealsRss(): Promise<CollectorResult> {
  const result: CollectorResult = {
    collectorName: 'Slickdeals Public RSS Feed',
    deals: [],
    coupons: [],
    fetchedAt: new Date().toISOString()
  };

  const feedUrls = [
    'https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchin=first&rss=1',
    'https://slickdeals.net/newsearch.php?mode=popdeals&searcharea=deals&searchin=first&rss=1'
  ];

  for (const url of feedUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8'
        }
      });

      if (!response.ok) {
        console.warn(`[SlickdealsCollector] HTTP ${response.status} from ${url}`);
        continue;
      }

      const xml = await response.text();
      const items = parseRssFeed(xml);

      for (const item of items) {
        const title = item.title;
        const desc = item.description || '';
        const combined = `${title} ${desc}`;

        // Expiration check: if marked expired in title or body
        const isExpired = /\b(expired|dead deal|out of stock)\b/i.test(title) || /\[expired\]/i.test(title);

        // Identify retailer
        let storeInfo: { id: string; name: string; domain: string; logo: string } | undefined = RETAILER_MAPPINGS.find(r => r.pattern.test(combined));
        if (!storeInfo) {
          // Attempt generic retailer name from format: "StoreName: Product..." or "[StoreName] Product..."
          const prefixMatch = title.match(/^(?:\[([^\]]+)\]|([A-Za-z0-9\s&'.]+):)/);
          const rawStore = prefixMatch ? (prefixMatch[1] || prefixMatch[2]).trim() : 'Online Retailer';
          const slug = rawStore.toLowerCase().replace(/[^a-z0-9]/g, '');
          storeInfo = {
            id: `store-${slug || 'general'}`,
            name: rawStore,
            domain: `${slug || 'online'}.com`,
            logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80'
          };
        }

        // Price parsing
        const priceMatches = combined.match(/\$([0-9]+(?:\.[0-9]{2})?)/g);
        let currentPrice = 0;
        let originalPrice: number | undefined;

        if (priceMatches && priceMatches.length > 0) {
          const prices = priceMatches.map(p => parseFloat(p.replace('$', ''))).filter(p => !isNaN(p));
          if (prices.length >= 2) {
            // Lowest is typically sale price, highest is regular MSRP
            currentPrice = Math.min(...prices);
            originalPrice = Math.max(...prices);
          } else if (prices.length === 1) {
            currentPrice = prices[0];
          }
        }

        // Free classification check
        const isFree = /\b(free|\$0)\b/i.test(title) && currentPrice === 0;
        const freeClassification = isFree ? '$0_FREE' : 'NOT_FREE';

        // Coupon code extraction
        // Looks for: "w/ code ABCD12", "apply promo code SAVE20", "use code FRESH"
        const codeMatch = combined.match(/(?:promo code|coupon code|with code|w\/\s*code|apply code|use code|code:?)\s+([A-Z0-9_\-]{3,20})/i);
        let couponCode: string | undefined;

        if (codeMatch && codeMatch[1]) {
          const extracted = codeMatch[1].trim().toUpperCase();
          // Filter out false positive common English words
          const ignoredWords = new Set(['FREE', 'SAVE', 'SALE', 'DEAL', 'WITH', 'FROM', 'SHIPPING', 'PRIME', 'MEMBER', 'CART', 'CHECKOUT']);
          if (!ignoredWords.has(extracted) && extracted.length >= 3) {
            couponCode = extracted;

            // Generate an unverified coupon entry per Requirement 7
            result.coupons.push({
              storeName: storeInfo.name,
              storeSlug: storeInfo.id,
              storeLogo: storeInfo.logo,
              storeUrl: `https://${storeInfo.domain}`,
              code: couponCode,
              discount: originalPrice && currentPrice ? `$${(originalPrice - currentPrice).toFixed(2)} OFF` : 'Promotional Discount',
              discountType: 'DOLLAR_OFF',
              discountValue: originalPrice && currentPrice ? Number((originalPrice - currentPrice).toFixed(2)) : undefined,
              description: `Community reported code for: ${title}`,
              source: 'Slickdeals Public RSS Feed',
              sourceUrl: item.link,
              dateCollected: new Date().toISOString(),
              expirationDate: null,
              verificationStatus: 'UNVERIFIED' // Never labeled as verified unless tested at checkout
            });
          }
        }

        // Calculate discount percentage
        let discountDisplay = currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'Special Offer';
        if (originalPrice && originalPrice > currentPrice) {
          const pct = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
          discountDisplay = `${pct}% OFF ($${currentPrice.toFixed(2)})`;
        } else if (isFree) {
          discountDisplay = '100% $0 FREE';
        }

        // Expiration date calculation (RSS items are valid while supplies last or standard 7-day circular window)
        const pubDateObj = item.pubDate ? new Date(item.pubDate) : new Date();
        const expirationDate = new Date(pubDateObj.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        result.deals.push({
          title,
          description: desc.replace(/<[^>]+>/g, '').trim().substring(0, 300),
          storeName: storeInfo.name,
          storeId: storeInfo.id,
          storeDomain: storeInfo.domain,
          storeLogo: storeInfo.logo,
          currentPrice: currentPrice || 0.01,
          originalPrice: originalPrice || (currentPrice ? Number((currentPrice * 1.3).toFixed(2)) : undefined),
          discountDisplay,
          dealType: couponCode ? 'coupon_code' : (isFree ? 'free_offer' : 'sale'),
          category: 'Retail & Electronics',
          targetUrl: item.link,
          productImage: item.thumbnailUrl || storeInfo.logo,
          couponCode,
          freeClassification,
          source: 'Slickdeals Public RSS Feed',
          sourceUrl: item.link,
          dateCollected: new Date().toISOString(),
          expirationDate: isExpired ? new Date().toISOString() : expirationDate,
          isExpired,
          verificationStatus: 'COMMUNITY_REPORTED',
          tags: [storeInfo.name, 'Public Feed', couponCode ? 'Promo Code' : 'Markdown']
        });
      }
    } catch (err: any) {
      console.warn(`[SlickdealsCollector] Error fetching ${url}:`, err.message);
      result.error = err.message;
    }
  }

  return result;
}
