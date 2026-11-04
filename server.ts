import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer, createLogger } from 'vite';
import { authRouter } from './src/server/routes/auth.routes.js';
import { companiesRouter } from './src/server/routes/companies.routes.js';
import { dashboardRouter } from './src/server/routes/dashboard.routes.js';
import { vehiclesRouter } from './src/server/routes/vehicles.routes.js';
import { convoyRouter } from './src/server/routes/convoy.routes.js';
import { invoicesRouter } from './src/server/routes/invoices.routes.js';
import { usersRouter } from './src/server/routes/users.routes.js';
import { chatRouter } from './src/server/routes/chat.routes.js';
import { auditRouter } from './src/server/routes/audit.routes.js';
import { setupChatWebSocket } from './src/server/chat/chatServer.js';

// Clean up any global __dirname that may interfere with ESM packages like vite-plugin-pwa
if ('__dirname' in globalThis) {
  delete (globalThis as any).__dirname;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Basic security and parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger in dev
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'JMF Fleet & Mobility API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/companies', companiesRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/vehicles', vehiclesRouter);
  app.use('/api/convoy', convoyRouter);
  app.use('/api/invoices', invoicesRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/audit', auditRouter);

  // Global 404 handler for API routes
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route API introuvable : ${req.method} ${req.path}` });
  });

  const httpServer = http.createServer(app);
  setupChatWebSocket(httpServer);

  // Vite middleware in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    const origError = logger.error.bind(logger);
    logger.error = (msg, options) => {
      if (typeof msg === 'string' && (msg.includes('WebSocket server error') || msg.includes('Port 24678') || msg.includes('[vite] failed to connect'))) {
        return;
      }
      origError(msg, options);
    };

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
      },
      customLogger: logger,
      appType: 'spa',
    });

    // Cleanly guard @vite/client against sending on closed/connecting sockets in sandbox
    app.use((req, res, next) => {
      if (req.path === '/@vite/client') {
        const origWrite = res.write;
        const origEnd = res.end;
        const chunks: Buffer[] = [];

        res.write = function (chunk: any, ...args: any[]) {
          if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          return true;
        } as any;

        res.end = function (chunk: any, ...args: any[]) {
          if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          let body = Buffer.concat(chunks).toString('utf8');
          // Guard against ws.send throwing when socket is closed or not open
          body = body.replace(
            'ws.send(JSON.stringify(data));',
            'if (ws && ws.readyState === 1) { ws.send(JSON.stringify(data)); }'
          );
          // Suppress unhandled send rejection logging from hmrClient
          body = body.replace(
            'this.logger.error(err);',
            '/* benign HMR send error ignored in sandbox */'
          );
          res.setHeader('Content-Length', Buffer.byteLength(body));
          return (origEnd as any).call(res, body, ...args);
        } as any;
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        etag: true,
        maxAge: '7d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else if (/\.(png|jpe?g|webp|svg|ico|woff2?)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
          } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 JMF Fleet & Mobility server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
