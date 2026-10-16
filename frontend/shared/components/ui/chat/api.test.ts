import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchTenantInfo, sendMessage } from './api.ts';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const json = (status: number, body: unknown) => async () => new Response(JSON.stringify(body), { status });
const payload = { sessionId: null, message: 'hola', language: 'es' };

test('info: 404 is unavailable, 500 is an error, a network failure is an error', async () => {
  globalThis.fetch = json(404, {}) as typeof fetch;
  assert.deepEqual(await fetchTenantInfo('demo-x'), { status: 'unavailable' });
  globalThis.fetch = json(500, {}) as typeof fetch;
  assert.deepEqual(await fetchTenantInfo('demo-x'), { status: 'error' });
  globalThis.fetch = (async () => {
    throw new TypeError('offline');
  }) as typeof fetch;
  assert.deepEqual(await fetchTenantInfo('demo-x'), { status: 'error' });
});

test('info: a request that never answers ends as an error after the timeout', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = ((_url: string, init: RequestInit) =>
    new Promise((_resolve, reject) => {
      init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    })) as typeof fetch;
  const pending = fetchTenantInfo('demo-x');
  t.mock.timers.tick(10_000);
  assert.deepEqual(await pending, { status: 'error' });
});

test('send: reads state and remaining, and rejects invalid values', async () => {
  globalThis.fetch = json(200, { respuesta: 'Hola', estado: 'x', restantes: 3, sesion_id: 's1' }) as typeof fetch;
  const result = await sendMessage('demo-x', payload);
  assert.deepEqual(result, { ok: true, sessionId: 's1', reply: 'Hola', action: null, state: 'x', remaining: 3 });
  globalThis.fetch = json(200, { respuesta: 'Hola', restantes: -1 }) as typeof fetch;
  const bad = await sendMessage('demo-x', payload);
  assert.equal(bad.ok && bad.remaining, null);
});

test('send: only wa.me actions are accepted', async () => {
  globalThis.fetch = json(200, { respuesta: 'a', accion: { tipo: 'whatsapp', url: 'https://wa.me/1', codigo: 'K1' } }) as typeof fetch;
  const good = await sendMessage('demo-x', payload);
  assert.deepEqual(good.ok && good.action, { kind: 'whatsapp', url: 'https://wa.me/1', code: 'K1' });
  globalThis.fetch = json(200, { respuesta: 'a', accion: { tipo: 'whatsapp', url: 'https://evil.example/1' } }) as typeof fetch;
  const evil = await sendMessage('demo-x', payload);
  assert.equal(evil.ok && evil.action, null);
});

test('send: 429 carries the fixed text and state; an aborted signal never sends', async () => {
  globalThis.fetch = json(429, { respuesta: 'Límite', estado: 'demo_limite_ip' }) as typeof fetch;
  assert.deepEqual(await sendMessage('demo-x', payload), { ok: false, reason: 'limit', reply: 'Límite', state: 'demo_limite_ip' });
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('{}');
  }) as typeof fetch;
  const controller = new AbortController();
  controller.abort();
  assert.deepEqual(await sendMessage('demo-x', payload, controller.signal), { ok: false, reason: 'network' });
  assert.equal(called, false);
});
