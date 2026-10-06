import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const previewStore = ((globalThis as any).__wtoPreviewStore ??
  ((globalThis as any).__wtoPreviewStore = new Map<string, {
    files: Array<{ path: string; content: string; base64?: string }>;
    createdAt: number;
  }>())
) as Map<string, {
  files: Array<{ path: string; content: string; base64?: string }>;
  createdAt: number;
}>;

function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && process?.release?.name === 'node';
}

function getContentType(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  if (ext === '.html') return 'text/html';
  if (ext === '.css') return 'text/css';
  if (ext === '.js') return 'application/javascript';
  if (ext === '.json') return 'application/json';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

const RESERVED_SUBDOMAINS = new Set([
  'builder',
  'www',
  'app',
  'api',
  'admin',
  'super-admin',
  'dashboard',
  'preview',
  'static',
  'assets',
  'cdn',
  'mail',
  'smtp',
  'ftp',
  'staging',
  'test',
  'dev',
  'demo',
  'site',
  'sites',
]);

function extractSubdomainSlug(hostname: string): string | null {
  const host = hostname.toLowerCase().split(':')[0];
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') return null;

  if (host.endsWith('.webtoolocean.com')) {
    const slug = host.slice(0, -'.webtoolocean.com'.length);
    if (slug && !RESERVED_SUBDOMAINS.has(slug)) return slug;
    return null;
  }

  if (host.endsWith('.localhost')) {
    const slug = host.slice(0, -'.localhost'.length);
    if (slug && !RESERVED_SUBDOMAINS.has(slug)) return slug;
    return null;
  }

  const parts = host.split('.');
  if (parts.length >= 3) {
    const first = parts[0];
    if (first && !RESERVED_SUBDOMAINS.has(first)) return first;
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;
    const supportsFs = isNodeRuntime();
    let path: typeof import('path') | null = null;
    let fsp: typeof import('fs').promises | null = null;

    if (supportsFs) {
      path = await import('path');
      fsp = (await import('fs')).promises;
    }

    try {
      if (pathname === '/__wto/preview') {
          return new Response(JSON.stringify({ ok: true, message: 'Preview is now rendered in-memory and does not require server-side file generation.' }), {
            headers: { 'content-type': 'application/json' },
          });
      }

      if (pathname.startsWith('/preview/')) {
        return new Response('Not found', { status: 404 });
      }

      const subdomainSlug = extractSubdomainSlug(url.hostname);
      let effectiveRequest = request;

      if (
        subdomainSlug &&
        !pathname.startsWith('/assets/') &&
        !pathname.startsWith('/_') &&
        !pathname.startsWith('/site/') &&
        !pathname.startsWith('/favicon')
      ) {
        const rewrittenUrl = new URL(request.url);
        rewrittenUrl.pathname = `/site/${subdomainSlug}`;
        const targetPage = pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '');
        if (targetPage && targetPage !== 'index' && targetPage !== 'site') {
          rewrittenUrl.searchParams.set('page', targetPage);
        }
        effectiveRequest = new Request(rewrittenUrl.toString(), request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(effectiveRequest, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
  },
};
