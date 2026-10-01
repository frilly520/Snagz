import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app';
import { dealScheduler } from './server/collectors/scheduler';

const PORT = 3000;

async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const distPath = path.join(process.cwd(), 'dist');
    const distIndexExists = fs.existsSync(path.join(distPath, 'index.html'));

    if (!isProduction || !distIndexExists) {
      // Development mode or fallback when dist has not been pre-built
      console.log('[SNAGZ Server] Initializing Vite SPA middleware engine...');
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);

      // Robust SPA HTML fallback: intercepts all client-side navigation requests
      // ensuring / and deep routes (e.g. /deals, /stores, /promocodes) never 404
      const serveIndexHtml = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const url = req.originalUrl || req.url;

        // Skip API routes so they return JSON 404 if unmatched
        if (url.startsWith('/api')) {
          return res.status(404).json({
            error: 'API endpoint not found',
            path: url,
            method: req.method
          });
        }

        try {
          const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
          const rawHtml = await fs.promises.readFile(indexHtmlPath, 'utf-8');
          const transformedHtml = await vite.transformIndexHtml(url, rawHtml);
          res.status(200).set({ 'Content-Type': 'text/html' }).send(transformedHtml);
        } catch (e) {
          next(e);
        }
      };

      app.get('/', serveIndexHtml);
      app.get('*', serveIndexHtml);
      app.use('*', serveIndexHtml);
    } else {
      // Production mode with pre-built dist assets
      console.log('[SNAGZ Server] Serving static production build from dist/...');
      app.use(express.static(distPath));

      // Production SPA fallback for client routing
      const serveProdHtml = (req: express.Request, res: express.Response) => {
        const url = req.originalUrl || req.url;
        if (url.startsWith('/api')) {
          return res.status(404).json({
            error: 'API endpoint not found',
            path: url,
            method: req.method
          });
        }
        res.sendFile(path.join(distPath, 'index.html'));
      };

      app.get('/', serveProdHtml);
      app.get('*', serveProdHtml);
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Server running on port ${PORT}`);
      console.log(`SNAGZ Intelligence Server running on http://0.0.0.0:${PORT}`);
      
      // Start automated public deal & coupon collector
      dealScheduler.start(2000);
    });

    server.on('error', (err: any) => {
      console.error('Server listen error:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

export { app };
export default app;
