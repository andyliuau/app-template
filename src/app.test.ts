import { describe, it, expect } from 'vitest';
import { app } from './index.js';

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });
});

describe('GET /', () => {
  it('returns 200 and identifies the service as app-template', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.service).toBe('app-template');
  });
});
