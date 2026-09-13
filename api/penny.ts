import app from '../server/app';

// Vercel Serverless Function: GET /api/penny
// Direct file-based route on Vercel handling 1¢ penny clearance items and reports.
export default function handler(req: any, res: any) {
  if (!req.url.startsWith('/api')) {
    req.url = '/api/penny' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
  }
  return app(req, res);
}
