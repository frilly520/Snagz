import app from '../app';
import { db } from '../db';
import { pennyService } from '../pennyService';
import { priceFinderService } from '../priceFinderService';
import { feedManager } from '../collectors/feedManager';

// Vercel Serverless Function: Catch-all for all /api/* routes
export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, x-matched-path');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    // Stale-While-Revalidate: trigger feedManager.ensureFreshData() if last ingestion > 30 mins
    await feedManager.ensureFreshData(30 * 60 * 1000);

    // Reconstruct canonical subpath whether on Vercel or Node
    let subpath = '';
    if (req.query?.path) {
      subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path);
    }
    if (!subpath) {
      const raw = (req.url || '').split('?')[0];
      subpath = raw.replace(/^\/api\/?/, '').replace(/^\//, '');
    }

    const queryString = req.url && req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const canonicalPath = `/api/${subpath}`;

    // Fast-path direct responses for common GET reads on Vercel
    if (req.method === 'GET') {
      if (subpath === 'alerts/price-drops') {
        const payload = db.priceDropAlerts || [];
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'user-lists' || subpath === 'user/lists') {
        const payload = db.userLists || [];
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'watchlist' || subpath === 'user/watchlist') {
        const payload = db.watchlist || [];
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'alerts' || subpath === 'user/alerts') {
        const payload = db.dealAlerts || [];
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'saved-deals' || subpath === 'user/saved') {
        const payload = { savedDealIds: Array.from(db.savedDealIds || []), deals: [] };
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'user/hidden-deals') {
        const payload = { count: db.hiddenDeals ? db.hiddenDeals.size : 0, hiddenDeals: Array.from(db.hiddenDeals ? db.hiddenDeals.values() : []) };
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'promo-codes') {
        const stores = Array.from(new Set((db.promoCodes || []).map(p => p.storeName))).sort();
        const payload = {
          count: (db.promoCodes || []).length,
          promoCodes: db.promoCodes || [],
          stores
        };
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'admin/pipeline/trigger') {
        const summary = await feedManager.runIngestion();
        const payload = { success: true, message: 'Automated free deals & coupons collection completed', summary };
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'admin/pipeline/status') {
        const payload = {
          status: 'active',
          schedulerIntervalMinutes: 30,
          lastRun: feedManager.getLastRunSummary(),
          inMemoryDealsCount: db.deals.length,
          inMemoryCouponsCount: db.promoCodes.length
        };
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'penny/health') {
        const payload = pennyService.getHealth();
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'price-finder/search' || subpath === 'price-finder') {
        const q = req.query?.q as string;
        const category = req.query?.category as string;
        const payload = await priceFinderService.search({ q, category });
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath === 'price-finder/suggestions') {
        const payload = priceFinderService.getSearchSuggestions();
        if (typeof res.status === 'function') return res.status(200).json(payload);
        res.statusCode = 200;
        return res.end(JSON.stringify(payload));
      }

      if (subpath.startsWith('price-finder/product/')) {
        const prodId = subpath.replace('price-finder/product/', '');
        const product = priceFinderService.getProductById(prodId);
        if (product) {
          if (typeof res.status === 'function') return res.status(200).json(product);
          res.statusCode = 200;
          return res.end(JSON.stringify(product));
        }
      }

      if (subpath.startsWith('deals/')) {
        const dealId = subpath.replace('deals/', '');
        const deal = db.deals.find(d => d.id === dealId);
        if (deal) {
          if (typeof res.status === 'function') return res.status(200).json(deal);
          res.statusCode = 200;
          return res.end(JSON.stringify(deal));
        }
      }
    }

    // Ensure req.url matches Express expectations
    req.url = canonicalPath + queryString;
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel Catch-All Error]:', err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message || 'Internal error' }));
  }
}

