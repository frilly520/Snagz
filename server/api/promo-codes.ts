import { db } from '../db';
import { feedManager } from '../collectors/feedManager';

// Vercel Serverless Function: GET /api/promo-codes
export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    // Stale-While-Revalidate: trigger feedManager.ensureFreshData() if last ingestion > 30 mins
    await feedManager.ensureFreshData(30 * 60 * 1000);

    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost${rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl}`);
    
    const getParam = (key: string): string | undefined => {
      if (req.query && req.query[key] !== undefined) {
        return Array.isArray(req.query[key]) ? req.query[key][0] : String(req.query[key]);
      }
      const val = parsedUrl.searchParams.get(key);
      return val !== null ? val : undefined;
    };

    // Single promo code by ID lookup
    const singleId = getParam('id') || (!parsedUrl.pathname.endsWith('/promo-codes') && !parsedUrl.pathname.endsWith('/promo-codes/') ? parsedUrl.pathname.replace(/^\/api\/promo-codes\/?/, '').trim() : undefined);
    if (singleId) {
      const promo = db.promoCodes.find(p => p.id === singleId);
      if (!promo) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Promo code not found' }));
      }
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(200).json(promo);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(promo));
    }

    const q = (getParam('q') || '').toLowerCase().trim();
    const store = (getParam('store') || '').toLowerCase().trim();
    const filter = (getParam('filter') || 'All').trim();
    const verifiedOnly = getParam('verifiedOnly') !== 'false'; // default to verified

    let results = [...db.promoCodes];

    // Store filter
    if (store && store !== 'all') {
      results = results.filter(p => 
        p.storeSlug.toLowerCase() === store || 
        p.storeName.toLowerCase().includes(store)
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      results = results.filter(p => p.verificationStatus === 'VERIFIED');
    }

    // Search filter
    if (q) {
      results = results.filter(p => 
        p.storeName.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.discount.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.restrictions && p.restrictions.toLowerCase().includes(q))
      );
    }

    // Category / Discount filter
    if (filter && filter !== 'All') {
      if (filter === '20%+ Off') {
        results = results.filter(p => (p.discountType === 'PERCENT_OFF' || p.discountType === 'CLEARANCE') && (p.discountValue || 0) >= 20);
      } else if (filter === '$ Off') {
        results = results.filter(p => p.discountType === 'DOLLAR_OFF');
      } else if (filter === 'Free Shipping') {
        results = results.filter(p => p.discountType === 'FREE_SHIPPING');
      } else if (filter === 'New Customers') {
        results = results.filter(p => p.discountType === 'NEW_CUSTOMER');
      } else if (filter === 'Clearance') {
        results = results.filter(p => p.discountType === 'CLEARANCE');
      } else if (filter === 'Expiring Soon') {
        const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
        results = results.filter(p => {
          if (!p.expirationDate) return false;
          const exp = new Date(p.expirationDate).getTime();
          return !isNaN(exp) && exp <= thirtyDaysFromNow;
        });
      }
    }

    // Extract unique store names for filtering
    const stores = Array.from(new Set(db.promoCodes.map(p => p.storeName))).sort();

    const payload = {
      count: results.length,
      promoCodes: results,
      stores
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(payload);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(payload));
    }
  } catch (err: any) {
    console.error('[Vercel API] Error in /api/promo-codes:', err);
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json({ error: err.message || 'Failed to fetch promo codes' });
    } else {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message || 'Failed to fetch promo codes' }));
    }
  }
}
