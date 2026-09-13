import app from '../server/app';

// Vercel Serverless Function: GET /api/deals
// Direct file-based route on Vercel handling all deal queries, search, and sorting.
export default function handler(req: any, res: any) {
  if (!req.url.startsWith('/api')) {
    req.url = '/api/deals' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
  }
  return app(req, res);
}
