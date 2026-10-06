// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      // Dev-only preview writer endpoint: POST /__wto/preview
      {
        name: 'wto-preview-endpoint',
        configureServer(server) {
          const fsp = fs.promises;
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            const method = req.method || 'GET';
            const host = (req.headers.host || '').split(':')[0].toLowerCase();

            if (host.endsWith('.localhost')) {
              const sub = host.slice(0, -'.localhost'.length);
              const reserved = ['builder', 'www', 'app', 'api', 'admin', 'super-admin', 'dashboard', 'preview', 'static', 'assets'];
              if (sub && !reserved.includes(sub)) {
                if (url === '/' || (!url.startsWith('/@') && !url.startsWith('/src') && !url.startsWith('/node_modules') && !url.startsWith('/site') && !url.startsWith('/assets'))) {
                  const targetPage = url.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '');
                  req.url = '/site/' + sub + (targetPage && targetPage !== 'index' ? '?page=' + targetPage : '');
                }
              }
            }

            if (method === 'GET') {
              const parsed = new URL(url, 'http://localhost');
              let filePath = '';

              if (url.startsWith('/preview/')) {
                const requestPath = parsed.pathname.replace(/^\/preview\//, '');
                filePath = requestPath === '' || requestPath.endsWith('/')
                  ? path.join(process.cwd(), 'public', 'preview', requestPath, 'index.html')
                  : path.join(process.cwd(), 'public', 'preview', requestPath);
              } else if (/\.(jpg|jpeg|png|webp|svg|gif|ico)$/i.test(parsed.pathname)) {
                filePath = path.join(process.cwd(), 'public', parsed.pathname.replace(/^\//, ''));
              }

              if (filePath) {
                try {
                  const stat = await fsp.stat(filePath);
                  if (stat.isFile()) {
                    const ext = path.extname(filePath).toLowerCase();
                    const contentType =
                      ext === '.html'
                        ? 'text/html'
                        : ext === '.css'
                        ? 'text/css'
                        : ext === '.js'
                        ? 'application/javascript'
                        : ext === '.json'
                        ? 'application/json'
                        : ext === '.svg'
                        ? 'image/svg+xml'
                        : ext === '.jpg' || ext === '.jpeg'
                        ? 'image/jpeg'
                        : ext === '.png'
                        ? 'image/png'
                        : ext === '.webp'
                        ? 'image/webp'
                        : ext === '.gif'
                        ? 'image/gif'
                        : 'application/octet-stream';
                    res.statusCode = 200;
                    res.setHeader('content-type', contentType);
                    res.setHeader('cache-control', 'public, max-age=3600');
                    const contents = await fsp.readFile(filePath);
                    res.end(contents);
                    return;
                  }
                } catch {
                  // file does not exist, continue
                }
              }
            }

            try {
              if (!url.startsWith('/__wto/preview') || method !== 'POST') return next();
              let body = '';
              for await (const chunk of req) body += chunk;
              const payload = JSON.parse(body || '{}');
              const slug = String(payload.slug || '').replace(/[^a-z0-9-]/gi, '-');
              if (!slug) {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'missing-slug' }));
                return;
              }
              const outDir = path.join(process.cwd(), 'public', 'preview', slug);
              await fsp.mkdir(outDir, { recursive: true });
              const files = Array.isArray(payload.files) ? payload.files : [];
              for (const f of files) {
                const target = path.join(outDir, String(f.path).replace(/^\/+/, ''));
                await fsp.mkdir(path.dirname(target), { recursive: true });
                if (f.base64) {
                  const buf = Buffer.from(f.base64, 'base64');
                  await fsp.writeFile(target, buf);
                } else {
                  await fsp.writeFile(target, String(f.content || ''));
                }
              }
              const indexFile = path.join(outDir, 'index.html');
              if (!(await fsp.stat(indexFile).catch(() => false))) {
                const firstPage = files.find((f) => /\.html?$/.test(String(f.path)));
                if (firstPage) {
                  await fsp.writeFile(indexFile, String(firstPage.content || ''));
                }
              }
              const notFoundPath = path.join(outDir, '404.html');
              const redirectHtml = '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./index.html"><title>Redirect</title>';
              await fsp.writeFile(notFoundPath, redirectHtml);
              res.statusCode = 200;
              res.setHeader('content-type', 'application/json');
              res.end(JSON.stringify({ ok: true, url: '/preview/' + slug + '/index.html' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: String(err && err.stack ? err.stack : err) }));
            }
          });
        },
      } as any,
    ],
  },
});
