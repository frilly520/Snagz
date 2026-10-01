import { CollectorResult, RawDiscoveredDeal } from './types';

export async function fetchGamerpowerGiveaways(): Promise<CollectorResult> {
  const result: CollectorResult = {
    collectorName: 'GamerPower Public Giveaway Feed',
    deals: [],
    coupons: [],
    fetchedAt: new Date().toISOString()
  };

  try {
    const url = 'https://www.gamerpower.com/api/giveaways?type=game';
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GamerPower API responded with HTTP ${response.status}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) {
      return result;
    }

    for (const item of items) {
      // Parse regular value from "worth": e.g. "$29.99"
      const worthMatch = (item.worth || '').match(/([0-9]+(?:\.[0-9]{2})?)/);
      const regularPrice = worthMatch ? parseFloat(worthMatch[1]) : 19.99;

      // Parse expiration: item.end_date can be "2026-10-15 23:59:00" or "N/A"
      let expirationDate: string | null = null;
      let isExpired = false;

      if (item.end_date && item.end_date !== 'N/A') {
        const expObj = new Date(item.end_date);
        if (!isNaN(expObj.getTime())) {
          expirationDate = expObj.toISOString();
          isExpired = expObj.getTime() < Date.now();
        }
      }

      // If already expired, skip or mark expired
      if (item.status && item.status.toLowerCase() === 'expired') {
        isExpired = true;
      }

      const storeName = item.platforms ? item.platforms.split(',')[0].trim() : 'Digital Store';
      const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '');

      result.deals.push({
        title: `[100% $0 FREE] ${item.title}`,
        description: item.description || `Grab ${item.title} for $0 free. Regular price $${regularPrice.toFixed(2)}. ${item.instructions || ''}`,
        storeName,
        storeId: `store-${storeSlug || 'digital'}`,
        storeDomain: 'giveaway.com',
        storeLogo: item.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&q=80',
        currentPrice: 0.00,
        originalPrice: regularPrice,
        discountDisplay: '100% $0 FREE',
        dealType: 'free_offer',
        category: 'Digital & Entertainment',
        targetUrl: item.open_giveaway_url || item.gamerpower_url || '#',
        productImage: item.image || item.thumbnail,
        freeClassification: '$0_FREE',
        source: 'GamerPower Public Giveaway Feed',
        sourceUrl: item.open_giveaway_url || item.gamerpower_url || '#',
        dateCollected: new Date().toISOString(),
        expirationDate,
        isExpired,
        verificationStatus: 'SOURCE_VERIFIED',
        tags: [storeName, 'Freebie', '100% Free', '$0 Deal', 'Verified Giveaway']
      });
    }
  } catch (err: any) {
    console.warn('[GamerPowerCollector] Failed to fetch giveaways:', err.message);
    result.error = err.message;
  }

  return result;
}
