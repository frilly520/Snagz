import { db } from '../db';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, x-matched-path');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost${rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl}`);
    const id = (req.query?.id as string) || parsedUrl.searchParams.get('id') || (!parsedUrl.pathname.endsWith('/stores') && !parsedUrl.pathname.endsWith('/stores/') ? parsedUrl.pathname.replace(/^\/api\/stores\/?/, '').trim() : undefined);

    if (id) {
      const store = db.stores.find(s => s.id === id || s.slug === id || s.name.toLowerCase() === id.toLowerCase());
      if (!store) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Store not found' }));
      }
      const storeDeals = db.deals.filter(d => d.storeId === store.id);
      const payload = { store, deals: storeDeals };
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(200).json(payload);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(payload));
    }

    const category = req.query?.category || parsedUrl.searchParams.get('category');

    let stores = db.stores;
    if (category && category !== 'All') {
      stores = stores.filter(s => s.category === category || s.retailerCategory === category);
    }

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(stores);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(stores));
    }
  } catch (err: any) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message || 'Failed to fetch stores' }));
  }
}
