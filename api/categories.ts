import { db } from '../server/db';

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
    const categoryMap: Record<string, number> = {};
    db.deals.forEach(deal => {
      const cat = deal.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    }));

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(categories);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(categories));
    }
  } catch (err: any) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message || 'Failed to fetch categories' }));
  }
}
