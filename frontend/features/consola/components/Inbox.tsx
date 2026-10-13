'use client';

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { useConsoleApi } from '../api/ConsoleApiContext';
import { copy } from '../copy';
import { formatMonth } from '../lib/format';
import type { Channel, ConsoleError, ConversationSummary, MonthKey, Tenant } from '../types';
import { InboxFilters } from './InboxFilters';
import { InboxRow } from './InboxRow';
import { ZoneStatus } from './ZoneStatus';

export interface InboxHandle {
  focusRow: (id: string) => void;
}

interface Filters {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
  readyOnly: boolean;
}

interface InboxProps extends Filters {
  tenants: Tenant[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onFiltersChange: (patch: Partial<Omit<Filters, 'month'>>) => void;
  ref?: Ref<InboxHandle>;
}

type Loaded =
  | {
      filters: Filters;
      reloads: number;
      items: ConversationSummary[];
      nextCursor: string | null;
      more: 'idle' | 'loading' | 'error';
      moreError: ConsoleError | null;
    }
  | { filters: Filters; reloads: number; error: ConsoleError };

export function Inbox({
  month, tenantId, channel, readyOnly, tenants, selectedId, onSelect, onFiltersChange, ref,
}: InboxProps) {
  const api = useConsoleApi();
  const filters = useMemo<Filters>(() => ({ month, tenantId, channel, readyOnly }), [month, tenantId, channel, readyOnly]);
  const [reloads, setReloads] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const moreRequest = useRef<AbortController | null>(null);
  const retriedCursor = useRef(false);
  const focusAfterAppend = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({ focusRow: (id) => rows.current.get(id)?.focus() }), []);

  useEffect(() => {
    const controller = new AbortController();
    void api.listConversations(filters, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.ok && result.error.kind === 'aborted') return;
      retriedCursor.current = false;
      setLoaded(
        result.ok
          ? { filters, reloads, items: result.data.items, nextCursor: result.data.nextCursor, more: 'idle', moreError: null }
          : { filters, reloads, error: result.error },
      );
    });
    return () => {
      controller.abort();
      moreRequest.current?.abort();
    };
  }, [api, filters, reloads]);

  const current = loaded && loaded.filters === filters && loaded.reloads === reloads ? loaded : null;

  useEffect(() => {
    const id = focusAfterAppend.current;
    if (!id) return;
    focusAfterAppend.current = null;
    rows.current.get(id)?.focus();
  }, [loaded]);

  const loadMore = useCallback(async () => {
    if (!current || 'error' in current || !current.nextCursor || current.more === 'loading') return;
    const cursor = current.nextCursor;
    setLoaded({ ...current, more: 'loading', moreError: null });
    const controller = new AbortController();
    moreRequest.current = controller;
    const result = await api.listConversations({ ...filters, cursor }, controller.signal);
    if (controller.signal.aborted) return;
    if (result.ok) {
      focusAfterAppend.current = result.data.items[0]?.id ?? null;
      setLoaded((previous) =>
        previous && 'items' in previous && previous.filters === filters
          ? { ...previous, items: [...previous.items, ...result.data.items], nextCursor: result.data.nextCursor, more: 'idle' }
          : previous,
      );
    } else if (result.error.code === 'cursor_invalido' && !retriedCursor.current) {
      retriedCursor.current = true;
      setReloads((n) => n + 1);
    } else if (result.error.kind !== 'aborted') {
      setLoaded((previous) =>
        previous && 'items' in previous && previous.filters === filters
          ? { ...previous, more: 'error', moreError: result.error }
          : previous,
      );
    }
  }, [api, current, filters]);

  const filterNames = [
    tenantId ? (tenants.find((tenant) => tenant.id === tenantId)?.name ?? tenantId) : null,
    channel ? copy.channel[channel] : null,
    readyOnly ? copy.inbox.readyOnly : null,
  ].filter((name): name is string => name !== null);

  const clearFilters = () => onFiltersChange({ tenantId: undefined, channel: undefined, readyOnly: false });
  const tenantName = (id: string) => tenants.find((tenant) => tenant.id === id)?.name ?? id;

  return (
    <section
      aria-label={copy.inbox.region}
      aria-busy={current === null}
      className="flex min-h-0 w-full flex-col lg:w-[38%] lg:border-r lg:border-regla"
    >
      <InboxFilters
        tenants={tenants}
        tenantId={tenantId}
        channel={channel}
        readyOnly={readyOnly}
        onChange={onFiltersChange}
      />
      <div
        role="region"
        aria-label={copy.inbox.scroller}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {current === null && (
          <div className="px-4 py-4 lg:px-6">
            <ZoneStatus kind="loading" lines={6} />
          </div>
        )}
        {current && 'error' in current && (
          <div className="px-4 py-4 lg:px-6">
            <ZoneStatus kind="error" error={current.error} onRetry={() => setReloads((n) => n + 1)} />
          </div>
        )}
        {current && 'items' in current && current.items.length === 0 && (
          <div className="px-4 py-4 lg:px-6">
            <ZoneStatus
              kind="empty"
              message={
                filterNames.length
                  ? copy.inbox.emptyFiltered(formatMonth(month), filterNames.join(', '))
                  : copy.inbox.empty(formatMonth(month))
              }
              action={filterNames.length ? { label: copy.inbox.clearFilters, onClick: clearFilters } : undefined}
            />
          </div>
        )}
        {current && 'items' in current && current.items.length > 0 && (
          <>
            <ul aria-label={copy.inbox.label} data-inbox-list="" className="border-t border-regla">
              {current.items.map((item) => (
                <InboxRow
                  key={item.id}
                  item={item}
                  tenantName={tenantName(item.tenantId)}
                  selected={item.id === selectedId}
                  buttonRef={(element) => {
                    if (element) rows.current.set(item.id, element);
                    else rows.current.delete(item.id);
                  }}
                  onSelect={onSelect}
                />
              ))}
            </ul>
            <div className="flex flex-col items-start gap-3 px-4 py-4 lg:px-6">
              {current.more === 'error' && current.moreError && (
                <ZoneStatus kind="error" error={current.moreError} onRetry={loadMore} />
              )}
              {current.nextCursor && current.more !== 'error' && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={current.more === 'loading'}
                  aria-busy={current.more === 'loading'}
                  className="action action-outline cursor-pointer disabled:opacity-60"
                >
                  {copy.inbox.loadMore}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
