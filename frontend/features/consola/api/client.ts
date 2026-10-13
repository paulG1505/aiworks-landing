import { API_URL } from '@/shared/lib/apiUrl';
import type {
  ApiResult,
  ConsoleError,
  ConsoleErrorKind,
  ConversationDetail,
  ConversationPage,
  ConversationQuery,
  LoginCredentials,
  MonthSummary,
  SessionInfo,
  SummaryQuery,
} from '../types';
import { parseDetail, parseError, parsePage, parseSession, parseSummary } from './wire';

export const REQUEST_TIMEOUT_MS = 15_000;
export const DEFAULT_RETRY_AFTER_SECONDS = 60;
export const CONVERSATION_ID = /^[A-Za-z0-9_-]{1,64}$/;

export interface ConsoleApi {
  getSession(signal?: AbortSignal): Promise<ApiResult<SessionInfo>>;
  login(credentials: LoginCredentials, signal?: AbortSignal): Promise<ApiResult<SessionInfo>>;
  logout(signal?: AbortSignal): Promise<ApiResult<null>>;
  getSummary(query: SummaryQuery, signal?: AbortSignal): Promise<ApiResult<MonthSummary>>;
  listConversations(query: ConversationQuery, signal?: AbortSignal): Promise<ApiResult<ConversationPage>>;
  getConversation(id: string, signal?: AbortSignal): Promise<ApiResult<ConversationDetail>>;
}

export interface ConsoleApiOptions {
  /** Defaults to `${API_URL}/console/api`. */
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function failure(kind: ConsoleErrorKind, extra: Partial<ConsoleError> = {}): { ok: false; error: ConsoleError } {
  return { ok: false, error: { kind, status: null, code: null, retryAfterSeconds: null, ...extra } };
}

function kindForStatus(status: number): ConsoleErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 400 || status === 405 || status === 422) return 'invalid_request';
  if (status === 429) return 'rate_limited';
  return 'server';
}

function retryAfterHeader(response: Response): number | null {
  const raw = response.headers.get('Retry-After');
  if (raw === null || !/^\d+$/.test(raw.trim())) return null;
  return Number(raw.trim());
}

export function createConsoleApi(options: ConsoleApiOptions = {}): ConsoleApi {
  const baseUrl = (options.baseUrl ?? `${API_URL}/console/api`).replace(/\/+$/, '');
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  async function request<T>(
    path: string,
    init: { method: 'GET' } | { method: 'POST'; body: unknown },
    parse: ((body: unknown) => T | null) | null,
    signal?: AbortSignal,
  ): Promise<ApiResult<T>> {
    const fetchImpl = options.fetchImpl ?? fetch;
    const controller = new AbortController();
    let timedOut = false;
    const onCallerAbort = () => controller.abort();
    if (signal?.aborted) return failure('aborted');
    signal?.addEventListener('abort', onCallerAbort);
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetchImpl(`${baseUrl}${path}`, {
        method: init.method,
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal,
        ...(init.method === 'POST'
          ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(init.body) }
          : {}),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const { code, retryAfterSeconds } = parseError(body);
        const kind = kindForStatus(response.status);
        return failure(kind, {
          status: response.status,
          code,
          retryAfterSeconds:
            kind === 'rate_limited'
              ? (retryAfterSeconds ?? retryAfterHeader(response) ?? DEFAULT_RETRY_AFTER_SECONDS)
              : null,
        });
      }

      if (!parse) return { ok: true, data: null as T };
      const data = parse(await response.json().catch(() => null));
      if (data === null) return failure('bad_response', { status: response.status });
      return { ok: true, data };
    } catch {
      if (timedOut) return failure('timeout');
      if (signal?.aborted) return failure('aborted');
      return failure('network');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onCallerAbort);
    }
  }

  return {
    getSession: (signal) => request('/yo', { method: 'GET' }, parseSession, signal),

    login: (credentials, signal) =>
      request(
        '/login',
        {
          method: 'POST',
          body: { usuario: credentials.user, clave: credentials.password, codigo: credentials.code },
        },
        parseSession,
        signal,
      ),

    logout: (signal) => request<null>('/logout', { method: 'POST', body: {} }, null, signal),

    getSummary: (query, signal) => {
      const params = new URLSearchParams({ mes: query.month });
      if (query.tenantId) params.set('tenant', query.tenantId);
      if (query.channel) params.set('canal', query.channel);
      return request(`/resumen?${params}`, { method: 'GET' }, parseSummary, signal);
    },

    listConversations: (query, signal) => {
      const params = new URLSearchParams({ mes: query.month });
      if (query.tenantId) params.set('tenant', query.tenantId);
      if (query.channel) params.set('canal', query.channel);
      if (query.readyOnly) params.set('listas', '1');
      if (query.cursor) params.set('cursor', query.cursor);
      if (query.limit !== undefined) params.set('limite', String(query.limit));
      return request(`/conversaciones?${params}`, { method: 'GET' }, parsePage, signal);
    },

    getConversation: async (id, signal) => {
      if (!CONVERSATION_ID.test(id)) return failure('invalid_request');
      return request(`/conversaciones/${encodeURIComponent(id)}`, { method: 'GET' }, parseDetail, signal);
    },
  };
}

export function withUnauthorizedHandler(api: ConsoleApi, onUnauthorized: () => void): ConsoleApi {
  const guard = <A extends unknown[], T>(call: (...args: A) => Promise<ApiResult<T>>) =>
    async (...args: A): Promise<ApiResult<T>> => {
      const result = await call(...args);
      if (!result.ok && result.error.kind === 'unauthorized') onUnauthorized();
      return result;
    };

  return {
    getSession: guard(api.getSession.bind(api)),
    login: api.login,
    logout: guard(api.logout.bind(api)),
    getSummary: guard(api.getSummary.bind(api)),
    listConversations: guard(api.listConversations.bind(api)),
    getConversation: guard(api.getConversation.bind(api)),
  };
}
