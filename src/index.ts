import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { pathToFileURL } from 'node:url';

export const app = new Hono();

app.get('/', (c) =>
  c.json({
    service: 'app-template',
    status: 'ok',
  }),
);

app.get('/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT ?? 3000);

// Only start the HTTP server when this file is run directly (e.g. `node dist/index.js`
// or `tsx src/index.ts`). When imported by tests or other modules, the server stays
// dormant and `app` is exported for in-process testing.
const isMain =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  console.log(`[app-template] listening on port ${port}`);
  serve({ fetch: app.fetch, port });
}
