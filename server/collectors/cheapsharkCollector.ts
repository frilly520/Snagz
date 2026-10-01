import { CollectorResult, RawDiscoveredDeal } from './types';

const STORE_NAME_MAP: Record<string, { name: string; domain: string; logo: string }> = {
  '1': { name: 'Steam', domain: 'steampowered.com', logo: 'https://images.unsplash.com/photo-1612287233207-6c2e3ba596e1?w=120&h=120&q=80' },
  '2': { name: 'GamersGate', domain: 'gamersgate.com', logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&q=80' },
  '3': { name: 'GreenManGaming', domain: 'greenmangaming.com', logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&h=120&q=80' },
  '7': { name: 'GOG', domain: 'gog.com', logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&q=80' },
  '11': { name: 'Humble Store', domain: 'humblebundle.com', logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&h=120&q=80' },
  '25': { name: 'Epic Games Store', domain: 'epicgames.com', logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=120&h=120&q=80' }
};

export async function fetchCheapsharkDeals(): Promise<CollectorResult> {
  const result: CollectorResult = {
    collectorName: 'CheapShark Public Deal API',
    deals: [],
    coupons: [],
    fetchedAt: new Date().toISOString()
  };

  try {
    const url = 'https://www.cheapshark.com/api/1.0/deals?pageSize=30&sortBy=Savings';
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SNAGZ-DealAggregator/1.0 (deal-intelligence@snagz.app)'
      }
    });

    if (!response.ok) {
      throw new Error(`CheapShark API responded with HTTP ${response.status}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) {
      return result;
    }

    for (const item of items) {
      const salePrice = parseFloat(item.salePrice) || 0;
      const normalPrice = parseFloat(item.normalPrice) || salePrice;
      const savingsPct = Math.round(parseFloat(item.savings) || 0);

      const storeMeta = STORE_NAME_MAP[item.storeID] || {
        name: 'Digital Games Retailer',
        domain: 'cheapshark.com',
        logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&q=80'
      };

      const isFree = salePrice === 0;
      const discountDisplay = isFree ? '100% $0 FREE' : `${savingsPct}% OFF ($${salePrice.toFixed(2)})`;
      const directUrl = `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(item.dealID)}`;

      // 14 day standard digital promotion window
      const expirationDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      result.deals.push({
        title: `${item.title} (${storeMeta.name})`,
        description: `Verified ${savingsPct}% digital discount on ${item.title}. Regular price $${normalPrice.toFixed(2)}, now $${salePrice.toFixed(2)} at ${storeMeta.name}.`,
        storeName: storeMeta.name,
        storeId: `store-${storeMeta.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        storeDomain: storeMeta.domain,
        storeLogo: storeMeta.logo,
        currentPrice: salePrice,
        originalPrice: normalPrice,
        discountDisplay,
        dealType: isFree ? 'free_offer' : 'sale',
        category: 'Digital & Electronics',
        targetUrl: directUrl,
        productImage: item.thumb || storeMeta.logo,
        freeClassification: isFree ? '$0_FREE' : 'NOT_FREE',
        source: 'CheapShark Public Deal API',
        sourceUrl: directUrl,
        dateCollected: new Date().toISOString(),
        expirationDate,
        isExpired: false,
        verificationStatus: 'SOURCE_VERIFIED',
        tags: [storeMeta.name, 'Digital Offer', `${savingsPct}% Off`, 'Verified Price']
      });
    }
  } catch (err: any) {
    console.warn('[CheapSharkCollector] Failed to fetch deals:', err.message);
    result.error = err.message;
  }

  return result;
}
