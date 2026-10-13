'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONSOLE_PATH } from '@/shared/constants/site';
import { withUnauthorizedHandler, type ConsoleApi } from '../api/client';
import type { ApiResult, LoginCredentials, SessionInfo } from '../types';

export const IDLE_LIMIT_MS = 30 * 60 * 1000;
export const IDLE_CHECK_MS = 60 * 1000;

export type SessionState =
  | { status: 'checking' }
  | { status: 'anonymous' }
  | { status: 'expired' }
  | { status: 'signedOut' }
  | { status: 'disabled' }
  | { status: 'unavailable' }
  | { status: 'authenticated'; session: SessionInfo };

export interface ConsoleSession {
  state: SessionState;
  /** Wrapped so that a 401 expires the session and every success counts as activity. */
  api: ConsoleApi;
  login(credentials: LoginCredentials): Promise<ApiResult<SessionInfo>>;
  logout(): void;
  retry(): void;
}

export function useConsoleSession(rawApi: ConsoleApi): ConsoleSession {
  const router = useRouter();
  const [state, setState] = useState<SessionState>({ status: 'checking' });
  const [attempt, setAttempt] = useState(0);
  const lastActivity = useRef(0);

  const expire = useCallback(() => {
    setState((current) => (current.status === 'authenticated' ? { status: 'expired' } : current));
  }, []);

  const api = useMemo<ConsoleApi>(() => {
    const track = <A extends unknown[], T>(call: (...args: A) => Promise<ApiResult<T>>) =>
      async (...args: A): Promise<ApiResult<T>> => {
        const result = await call(...args);
        if (result.ok) lastActivity.current = Date.now();
        return result;
      };
    const guarded = withUnauthorizedHandler(rawApi, expire);
    return {
      ...guarded,
      getSummary: track(guarded.getSummary),
      listConversations: track(guarded.listConversations),
      getConversation: track(guarded.getConversation),
    };
  }, [rawApi, expire]);

  useEffect(() => {
    const controller = new AbortController();
    void rawApi.getSession(controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (result.ok) {
        lastActivity.current = Date.now();
        setState({ status: 'authenticated', session: result.data });
      } else if (result.error.kind === 'aborted') {
        return;
      } else if (result.error.kind === 'unauthorized') {
        setState({ status: 'anonymous' });
      } else if (result.error.kind === 'not_found') {
        setState({ status: 'disabled' });
      } else {
        setState({ status: 'unavailable' });
      }
    });
    return () => controller.abort();
  }, [rawApi, attempt]);

  const authenticated = state.status === 'authenticated';
  useEffect(() => {
    if (!authenticated) return;
    const check = () => {
      if (Date.now() - lastActivity.current >= IDLE_LIMIT_MS) expire();
    };
    const timer = setInterval(check, IDLE_CHECK_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [authenticated, expire]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await rawApi.login(credentials);
      if (result.ok) {
        lastActivity.current = Date.now();
        setState({ status: 'authenticated', session: result.data });
      }
      return result;
    },
    [rawApi],
  );

  const logout = useCallback(() => {
    setState({ status: 'signedOut' });
    router.replace(CONSOLE_PATH, { scroll: false });
    void rawApi.logout();
  }, [rawApi, router]);

  const retry = useCallback(() => {
    setState({ status: 'checking' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, api, login, logout, retry };
}
