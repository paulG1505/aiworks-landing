'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiResult, ConsoleError } from '../types';

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: ConsoleError };

type Fetcher<T> = (signal: AbortSignal) => Promise<ApiResult<T>>;

/** Loads on mount and whenever `fetcher` changes; a late answer never replaces a newer request. */
export function useApiResource<T>(fetcher: Fetcher<T>) {
  const [reloads, setReloads] = useState(0);
  const [settled, setSettled] = useState<{ fetcher: Fetcher<T>; reloads: number; result: ApiResult<T> } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetcher(controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.ok && result.error.kind === 'aborted') return;
      setSettled({ fetcher, reloads, result });
    });
    return () => controller.abort();
  }, [fetcher, reloads]);

  const reload = useCallback(() => setReloads((n) => n + 1), []);

  let state: ResourceState<T> = { status: 'loading' };
  if (settled && settled.fetcher === fetcher && settled.reloads === reloads) {
    state = settled.result.ok
      ? { status: 'ready', data: settled.result.data }
      : { status: 'error', error: settled.result.error };
  }
  return { state, reload };
}
