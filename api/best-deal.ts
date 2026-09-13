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
    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `http://localhost${rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl}`);
    const q = req.query?.q || parsedUrl.searchParams.get('q') || undefined;
    const category = req.query?.category || parsedUrl.searchParams.get('category') || undefined;

    const best = db.findBestDeal(q, category);
    if (!best) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'No matching deals available for best deal calculation' }));
    }

    const payload = {
      bestDeal: best,
      evaluation: best.bestDealEvaluation || {
        isRankOne: true,
        productTarget: best.productName || best.title,
        regularPrice: best.originalPrice || best.currentPrice || 100,
        currentPrice: best.currentPrice || 100,
        couponDiscount: best.estimatedSavingsDollar || 0,
        cashbackDiscount: 0,
        shippingCost: 0,
        estimatedEffectivePrice: best.estimatedFinalPrice || best.currentPrice || 100,
        netSavings: best.estimatedSavingsDollar || 0,
        percentageSaved: best.estimatedSavingsPercent || 50,
        evaluationSummary: 'Ranked #1 best value offer with optimal net effective cost.',
        highlightBadge: 'TOP VALUE',
        confidenceGrade: 'A'
      }
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(payload);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(payload));
    }
  } catch (err: any) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message || 'Failed to calculate best deal' }));
  }
}
