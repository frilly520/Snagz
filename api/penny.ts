import { pennyService } from '../server/pennyService';

// Vercel Serverless Function: GET /api/penny
// Direct file-based route on Vercel handling 1¢ penny clearance items and reports.
export default function handler(req: any, res: any) {
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
    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost${rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl}`);
    
    const getParam = (key: string): string | undefined => {
      if (req.query && req.query[key] !== undefined) {
        return Array.isArray(req.query[key]) ? req.query[key][0] : String(req.query[key]);
      }
      const val = parsedUrl.searchParams.get(key);
      return val !== null ? val : undefined;
    };

    const q = getParam('q');
    const category = getParam('category');
    const status = getParam('status') as any;
    const retailerId = getParam('storeNumber') || getParam('retailerId');
    const sort = getParam('sort');

    const result = pennyService.getPennyItemsSync({
      q,
      category,
      status,
      retailerId,
      sort
    });

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(result);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    }
  } catch (err: any) {
    console.error('[Vercel API] Error in /api/penny:', err);
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json({ error: err.message || 'Failed to load penny deals' });
    } else {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message || 'Failed to load penny deals' }));
    }
  }
}

