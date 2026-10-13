import { vi, type Mock } from 'vitest';
import type { ConsoleApi } from '../api/client';
import type { ApiResult, ConsoleError, ConsoleErrorKind } from '../types';
import { currentMonth } from '../lib/month';
import { SESSION, detail, manyRows, summaryOf } from './fixtures';

export type FakeApi = { [K in keyof ConsoleApi]: Mock<ConsoleApi[K]> };

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(kind: ConsoleErrorKind, extra: Partial<ConsoleError> = {}): ApiResult<T> {
  return { ok: false, error: { kind, status: null, code: null, retryAfterSeconds: null, ...extra } };
}

export function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

/** An in-memory ConsoleApi: three conversations, an empty-ish month, and every method replaceable. */
export function createFakeApi(overrides: Partial<ConsoleApi> = {}): FakeApi {
  const rows = manyRows(3).map((row, i) => ({ ...row, contact: `+593 ••• ••• 00${i + 1}` }));
  const defaults: ConsoleApi = {
    getSession: async () => ok(SESSION),
    login: async () => ok(SESSION),
    logout: async () => ok(null),
    getSummary: async (query) => ok(summaryOf(query.month ?? currentMonth(), [3, 0, 7])),
    listConversations: async (query) => {
      const items = rows.filter(
        (row) =>
          (!query.channel || row.channel === query.channel) &&
          (!query.tenantId || row.tenantId === query.tenantId) &&
          (!query.readyOnly || row.readyForCall),
      );
      return ok({ items, nextCursor: null });
    },
    getConversation: async (id) => {
      const row = rows.find((item) => item.id === id);
      return row ? ok(detail(id, { contact: row.contact })) : fail('not_found', { status: 404 });
    },
  };
  const merged = { ...defaults, ...overrides };
  return {
    getSession: vi.fn(merged.getSession),
    login: vi.fn(merged.login),
    logout: vi.fn(merged.logout),
    getSummary: vi.fn(merged.getSummary),
    listConversations: vi.fn(merged.listConversations),
    getConversation: vi.fn(merged.getConversation),
  };
}
