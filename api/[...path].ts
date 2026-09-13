import app from '../server/app';

// Vercel Serverless Function: Catch-all for all /api/* routes
export default function handler(req: any, res: any) {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
