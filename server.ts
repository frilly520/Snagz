import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { app } from './server/app';

const PORT = 3000;

async function startServer() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Server running on port ${PORT}`);
      console.log(`SNAGZ Intelligence Server running on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: any) => {
      console.error('Server listen error:', err);
    });

    // Vite SPA middleware for local development and AI Studio preview
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      // Production static file serving for container / Cloud Run deployment
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

export { app };
export default app;
