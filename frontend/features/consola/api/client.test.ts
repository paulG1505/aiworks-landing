import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_RETRY_AFTER_SECONDS,
  REQUEST_TIMEOUT_MS,
  createConsoleApi,
  withUnauthorizedHandler,
} from './client';
import { fail, ok } from '../testing/fakeApi';

const BASE = 'https://api.test/console/api';

const wireSession = { usuario: 'demo', tenants: [{ id: 'aiworks', nombre: 'AIworks' }] };
const wireSummary = {
  mes: '2026-10',
  totales: { conversaciones: 5, respuestas: 12, costo_usd: 0.0421, listas_para_llamada: 1 },
  por_dia: [{ dia: '2026-10-01', conversaciones: 3 }],
};
const wireRow = {
  id: 'c1', tenant: 'aiworks', canal: 'web', contacto: 'web · a1b2c3',
  creada: '2026-10-12T15:04:09Z', ultima_actividad: '2026-10-12T15:19:40Z',
  turnos: 5, senales_alcanzadas: 2, senales_total: 4, lista_para_llamada: false,
};
const wireDetail = {
  id: 'c1', tenant: 'aiworks', canal: 'web', contacto: 'web · a1b2c3',
  creada: '2026-10-12T15:04:09Z', ultima_actividad: '2026-10-12T15:19:40Z',
  turnos: 1, lista_para_llamada: false, idioma: 'es',
  senales: [{ clave: 'necesidad', nombre: 'Necesidad clara', alcanzada: true }],
  mensajes: [{ rol: 'visitante', texto: 'Hola', momento: '2026-10-12T15:04:09Z' }],
};

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

function setup(response: () => Response | Promise<Response> = () => json(wireSession)) {
  const fetchImpl = vi.fn(async (...args: Parameters<typeof fetch>) => (void args, response()));
  const api = createConsoleApi({ baseUrl: BASE, fetchImpl: fetchImpl as unknown as typeof fetch });
  return { api, fetchImpl };
}

describe('createConsoleApi', () => {
  it('sends credentials and no-store on every request', async () => {
    const { api, fetchImpl } = setup(() => json(wireSession));
    fetchImpl.mockImplementation(async (url) => {
      const path = String(url);
      if (path.includes('/resumen')) return json(wireSummary);
      if (path.includes('/conversaciones/')) return json(wireDetail);
      if (path.includes('/conversaciones')) return json({ elementos: [wireRow], siguiente: null });
      if (path.includes('/logout')) return new Response(null, { status: 204 });
      return json(wireSession);
    });

    await api.getSession();
    await api.login({ user: 'demo', password: 'x', code: '123456' });
    await api.logout();
    await api.getSummary({ month: '2026-10' });
    await api.listConversations({ month: '2026-10' });
    await api.getConversation('c1');

    expect(fetchImpl).toHaveBeenCalledTimes(6);
    for (const [, init] of fetchImpl.mock.calls) {
      expect(init).toMatchObject({ credentials: 'include', cache: 'no-store' });
    }
    const withContentType = fetchImpl.mock.calls
      .filter(([, init]) => (init?.headers as Record<string, string> | undefined)?.['Content-Type'] === 'application/json')
      .map(([url]) => String(url));
    expect(withContentType).toEqual([`${BASE}/login`, `${BASE}/logout`]);
  });

  it('sends GET without own headers and POST with a JSON body', async () => {
    const { api, fetchImpl } = setup();
    await api.getSession();
    await api.login({ user: 'demo', password: 'secret', code: '123456' });
    await api.logout();

    const [get, login, logout] = fetchImpl.mock.calls;
    expect(get[1]?.headers).toBeUndefined();
    expect(login[1]?.method).toBe('POST');
    expect(JSON.parse(login[1]?.body as string)).toEqual({ usuario: 'demo', clave: 'secret', codigo: '123456' });
    expect(logout[1]?.body).toBe('{}');
  });

  it('builds the query string with only the filters that are set', async () => {
    const { api, fetchImpl } = setup(() => json({ elementos: [], siguiente: null }));
    await api.listConversations({ month: '2026-10' });
    await api.listConversations({
      month: '2026-09', tenantId: 'demo-panaderia', channel: 'whatsapp', readyOnly: true, cursor: 'abc', limit: 20,
    });
    await api.listConversations({ month: '2026-10', readyOnly: false });

    expect(String(fetchImpl.mock.calls[0][0])).toBe(`${BASE}/conversaciones?mes=2026-10`);
    const params = new URL(String(fetchImpl.mock.calls[1][0])).searchParams;
    expect(Object.fromEntries(params)).toEqual({
      mes: '2026-09', tenant: 'demo-panaderia', canal: 'whatsapp', listas: '1', cursor: 'abc', limite: '20',
    });
    expect(String(fetchImpl.mock.calls[2][0])).toBe(`${BASE}/conversaciones?mes=2026-10`);
  });

  it('rejects an invalid conversation id without touching the network and encodes a valid one', async () => {
    const { api, fetchImpl } = setup(() => json(wireDetail));
    const bad = await api.getConversation('../etc/passwd');
    expect(bad).toMatchObject({ ok: false, error: { kind: 'invalid_request' } });
    expect(fetchImpl).not.toHaveBeenCalled();

    await api.getConversation('c_8f2a-19d0');
    expect(String(fetchImpl.mock.calls[0][0])).toBe(`${BASE}/conversaciones/c_8f2a-19d0`);
  });

  it('reports a timeout when the API does not answer in time and aborted when the caller aborts', async () => {
    vi.useFakeTimers();
    try {
      const hang = (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
        });
      const api = createConsoleApi({ baseUrl: BASE, fetchImpl: hang as typeof fetch });

      const slow = api.getSession();
      await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
      expect(await slow).toMatchObject({ ok: false, error: { kind: 'timeout' } });

      const controller = new AbortController();
      const cancelled = api.getSession(controller.signal);
      controller.abort();
      expect(await cancelled).toMatchObject({ ok: false, error: { kind: 'aborted' } });

      const already = new AbortController();
      already.abort();
      expect(await api.getSession(already.signal)).toMatchObject({ ok: false, error: { kind: 'aborted' } });
    } finally {
      vi.useRealTimers();
    }
  });

  it('maps a rejected fetch to network', async () => {
    const { api } = setup(() => {
      throw new TypeError('Failed to fetch');
    });
    expect(await api.getSession()).toMatchObject({ ok: false, error: { kind: 'network', status: null } });
  });

  it('maps statuses to error kinds, reads the code and resolves retryAfterSeconds', async () => {
    const cases: [number, string][] = [
      [401, 'unauthorized'], [403, 'forbidden'], [404, 'not_found'], [400, 'invalid_request'],
      [405, 'invalid_request'], [422, 'invalid_request'], [429, 'rate_limited'], [500, 'server'], [502, 'server'],
    ];
    for (const [status, kind] of cases) {
      const { api } = setup(() => json({ detail: { codigo: 'algo', mensaje: 'x' } }, { status }));
      const result = await api.getSession();
      expect(result).toMatchObject({ ok: false, error: { kind, status, code: 'algo' } });
    }

    const noBody = await setup(() => new Response('<html>', { status: 500 })).api.getSession();
    expect(noBody).toMatchObject({ ok: false, error: { kind: 'server', code: null, retryAfterSeconds: null } });

    const fromBody = await setup(() =>
      json({ detail: { codigo: 'bloqueado', mensaje: 'x', reintentar_en: 540 } }, { status: 429, headers: { 'Retry-After': '30' } }),
    ).api.getSession();
    expect(fromBody).toMatchObject({ ok: false, error: { retryAfterSeconds: 540 } });

    const fromHeader = await setup(() => json({}, { status: 429, headers: { 'Retry-After': '30' } })).api.getSession();
    expect(fromHeader).toMatchObject({ ok: false, error: { retryAfterSeconds: 30 } });

    const fallback = await setup(() => json({}, { status: 429 })).api.getSession();
    expect(fallback).toMatchObject({ ok: false, error: { retryAfterSeconds: DEFAULT_RETRY_AFTER_SECONDS } });
  });

  it('validates 2xx bodies against the contract and converts them to domain types', async () => {
    expect(await setup(() => json(wireSession)).api.getSession()).toEqual(ok({ user: 'demo', tenants: [{ id: 'aiworks', name: 'AIworks' }] }));

    const summary = await setup(() => json(wireSummary)).api.getSummary({ month: '2026-10' });
    expect(summary).toEqual(ok({
      month: '2026-10',
      totals: { conversations: 5, replies: 12, costUsd: 0.0421, readyForCall: 1 },
      days: [{ day: '2026-10-01', conversations: 3 }],
    }));

    const page = await setup(() => json({ elementos: [wireRow], siguiente: 'abc', extra: 1 })).api.listConversations({ month: '2026-10' });
    expect(page).toMatchObject({ ok: true, data: { nextCursor: 'abc', items: [{ tenantId: 'aiworks', signalsReached: 2, readyForCall: false }] } });

    const detail = await setup(() => json(wireDetail)).api.getConversation('c1');
    expect(detail).toMatchObject({ ok: true, data: { language: 'es', messages: [{ speaker: 'visitor' }], signals: [{ reached: true }] } });

    const invalid = [
      await setup(() => json({ usuario: 'demo' })).api.getSession(),
      await setup(() => json({ ...wireSummary, totales: { ...wireSummary.totales, costo_usd: '1' } })).api.getSummary({ month: '2026-10' }),
      await setup(() => json({ elementos: [{ ...wireRow, canal: 'sms' }], siguiente: null })).api.listConversations({ month: '2026-10' }),
      await setup(() => json({ elementos: [{ ...wireRow, senales_alcanzadas: 5 }], siguiente: null })).api.listConversations({ month: '2026-10' }),
      await setup(() => json({ ...wireDetail, mensajes: [{ rol: 'otro', texto: 'x', momento: 'y' }] })).api.getConversation('c1'),
      await setup(() => new Response('no json', { status: 200 })).api.getSession(),
    ];
    for (const result of invalid) expect(result).toMatchObject({ ok: false, error: { kind: 'bad_response' } });

    expect(await setup(() => new Response(null, { status: 204 })).api.logout()).toEqual(ok(null));
    expect(await setup(() => json({ cualquier: 'cosa' })).api.logout()).toEqual(ok(null));
  });

  it('never throws', async () => {
    const { api } = setup(() => {
      throw new Error('boom');
    });
    await expect(api.getSummary({ month: '2026-10' })).resolves.toMatchObject({ ok: false });
    await expect(api.login({ user: 'a', password: 'b', code: '123456' })).resolves.toMatchObject({ ok: false });
  });
});

describe('withUnauthorizedHandler', () => {
  it('calls the handler on every 401 except the one from login', async () => {
    const handler = vi.fn();
    const unauthorized = async () => fail<never>('unauthorized', { status: 401 });
    const wrapped = withUnauthorizedHandler(
      {
        getSession: unauthorized, login: unauthorized, logout: unauthorized,
        getSummary: unauthorized, listConversations: unauthorized, getConversation: unauthorized,
      },
      handler,
    );

    await wrapped.login({ user: 'a', password: 'b', code: '123456' });
    expect(handler).not.toHaveBeenCalled();

    await wrapped.getSummary({ month: '2026-10' });
    await wrapped.listConversations({ month: '2026-10' });
    await wrapped.getConversation('c1');
    expect(handler).toHaveBeenCalledTimes(3);
  });
});
