import { db } from '../server/db';
import { pennyService } from '../server/pennyService';

// Vercel Serverless Function: GET /api/deals
// Direct file-based route on Vercel handling all deal queries, search, and sorting.
export default function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, x-matched-path');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    // Parse query parameters from req.query (Vercel) or fallback to req.url
    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost${rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl}`);
    
    const getParam = (key: string): string | undefined => {
      if (req.query && req.query[key] !== undefined) {
        return Array.isArray(req.query[key]) ? req.query[key][0] : String(req.query[key]);
      }
      const val = parsedUrl.searchParams.get(key);
      return val !== null ? val : undefined;
    };

    const q = (getParam('q') || '').toLowerCase().trim();
    const category = getParam('category');
    const storeId = getParam('storeId');
    const freeType = getParam('freeType');
    const freeOnly = getParam('freeOnly') === 'true';
    const moneyMakerOnly = getParam('moneyMakerOnly') === 'true';
    const recipesOnly = getParam('recipesOnly') === 'true';
    const sort = getParam('sort') || 'best_deal';
    const minScore = getParam('minScore');
    const minConfidence = getParam('minConfidence');
    const expiringOnly = getParam('expiringOnly') === 'true';
    const featuredOnly = getParam('featuredOnly') === 'true';
    const channel = getParam('channel');
    const localOnly = getParam('localOnly') === 'true';

    let results = [...db.deals];

    // Store filter
    if (storeId) {
      results = results.filter(d => d.storeId === storeId);
    }

    // Category filter
    if (category && category !== 'All') {
      results = results.filter(d => d.category === category || d.subcategory === category);
    }

    // Free classification filter
    if (freeType) {
      results = results.filter(d => d.freeClassification === freeType);
    }

    // Free only filter
    if (freeOnly) {
      results = results.filter(d => 
        d.freeClassification === '$0_FREE' || 
        d.freeClassification === 'FREE_WITH_PURCHASE' || 
        d.freeClassification === 'FREE_SAMPLE' || 
        d.freeClassification === 'GIVEAWAY' || 
        d.currentPrice === 0 || 
        d.estimatedFinalPrice === 0
      );
    }

    // Money maker filter
    if (moneyMakerOnly) {
      results = results.filter(d => d.isMoneyMaker || (d.moneyMakerAmount && d.moneyMakerAmount > 0));
    }

    // Savings recipes filter
    if (recipesOnly) {
      results = results.filter(d => d.savingsRecipe && (d.savingsRecipe.coupons?.length > 0 || d.savingsRecipe.outOfPocketToday !== undefined));
    }

    // Score filter
    if (minScore) {
      const min = parseFloat(minScore);
      if (!isNaN(min)) results = results.filter(d => d.dealScore >= min);
    }

    // Confidence filter
    if (minConfidence) {
      const minC = parseFloat(minConfidence);
      if (!isNaN(minC)) results = results.filter(d => d.dataConfidence >= minC);
    }

    // Expiring soon filter
    if (expiringOnly) {
      results = results.filter(d => d.expiration.isExpiringSoon || d.verification.status === 'EXPIRING_SOON');
    }

    // Featured filter
    if (featuredOnly) {
      results = results.filter(d => d.isFeatured);
    }

    // Channel filter
    if (channel && channel !== 'ALL') {
      results = results.filter(d => d.channel === channel || d.channel === 'ONLINE_AND_IN_STORE');
    }

    // Local only filter
    if (localOnly) {
      results = results.filter(d => d.isLocalOnly);
    }

    // Search query & Retailer matching
    let matchedRetailer: any = null;
    if (q) {
      matchedRetailer = db.stores.find(s => 
        s.name.toLowerCase() === q ||
        s.slug === q ||
        q.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(q)
      );

      results = results.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.storeName.toLowerCase().includes(q) ||
        (d.productName && d.productName.toLowerCase().includes(q)) ||
        (d.code && d.code.toLowerCase().includes(q)) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sort) {
      case 'money_maker':
        results.sort((a, b) => {
          const aMM = a.isMoneyMaker ? (a.moneyMakerAmount || 1) : -1;
          const bMM = b.isMoneyMaker ? (b.moneyMakerAmount || 1) : -1;
          if (bMM !== aMM) return bMM - aMM;
          return (b.dealScore || 0) - (a.dealScore || 0);
        });
        break;
      case 'lowest_net':
        results.sort((a, b) => {
          const aNet = a.savingsRecipe?.effectiveNetCost ?? a.estimatedFinalPrice ?? a.currentPrice ?? 999;
          const bNet = b.savingsRecipe?.effectiveNetCost ?? b.estimatedFinalPrice ?? b.currentPrice ?? 999;
          return aNet - bNet;
        });
        break;
      case 'biggest_savings':
        results.sort((a, b) => (b.estimatedSavingsDollar || 0) - (a.estimatedSavingsDollar || 0));
        break;
      case 'highest_discount':
        results.sort((a, b) => (b.estimatedSavingsPercent || 0) - (a.estimatedSavingsPercent || 0));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'expiring_soon':
        results.sort((a, b) => {
          if (a.expiration.isExpiringSoon && !b.expiration.isExpiringSoon) return -1;
          if (!a.expiration.isExpiringSoon && b.expiration.isExpiringSoon) return 1;
          return (b.dealScore || 0) - (a.dealScore || 0);
        });
        break;
      case 'most_popular':
        results.sort((a, b) => (b.popularityCount || 0) - (a.popularityCount || 0));
        break;
      case 'recently_verified':
        results.sort((a, b) => new Date(b.verification.lastChecked).getTime() - new Date(a.verification.lastChecked).getTime());
        break;
      case 'best_deal':
      default:
        if (matchedRetailer) {
          results.sort((a, b) => {
            const aIsStore = a.storeId === matchedRetailer.id || a.storeName.toLowerCase().includes(matchedRetailer.name.toLowerCase());
            const bIsStore = b.storeId === matchedRetailer.id || b.storeName.toLowerCase().includes(matchedRetailer.name.toLowerCase());
            if (aIsStore && !bIsStore) return -1;
            if (!aIsStore && bIsStore) return 1;
            const aScore = (a.dealScore * 0.7) + (a.dataConfidence * 0.3);
            const bScore = (b.dealScore * 0.7) + (b.dataConfidence * 0.3);
            return bScore - aScore;
          });
        } else {
          results.sort((a, b) => {
            const aScore = (a.dealScore * 0.7) + (a.dataConfidence * 0.3);
            const bScore = (b.dealScore * 0.7) + (b.dataConfidence * 0.3);
            return bScore - aScore;
          });
        }
        break;
    }

    const payload = {
      count: results.length,
      matchedRetailer: matchedRetailer ? {
        id: matchedRetailer.id,
        name: matchedRetailer.name,
        logo: matchedRetailer.logo,
        category: matchedRetailer.category,
        retailerCategory: matchedRetailer.retailerCategory,
        weeklyAdUrl: matchedRetailer.weeklyAdUrl,
        loyaltyPerks: matchedRetailer.loyaltyPerks
      } : null,
      deals: results
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(payload);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(payload));
    }
  } catch (err: any) {
    console.error('[Vercel API] Error in /api/deals:', err);
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json({ error: err.message || 'Failed to fetch deals' });
    } else {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message || 'Failed to fetch deals' }));
    }
  }
}

