'use client';

import { useCallback, type RefObject } from 'react';
import { useConsoleApi } from '../api/ConsoleApiContext';
import { copy } from '../copy';
import { useApiResource } from '../hooks/useApiResource';
import { formatCost, formatCount, formatMonth } from '../lib/format';
import { lastTwelveMonths } from '../lib/month';
import type { Channel, MonthKey, MonthSummary as MonthSummaryData, Tenant } from '../types';
import { DailyChart } from './DailyChart';
import { ZoneStatus } from './ZoneStatus';

interface MonthSummaryProps {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
  tenants: Tenant[];
  headingRef: RefObject<HTMLHeadingElement | null>;
  onMonthChange: (month: MonthKey) => void;
}

const isEmpty = (summary: MonthSummaryData) =>
  summary.totals.conversations === 0 &&
  summary.totals.replies === 0 &&
  summary.totals.costUsd === 0 &&
  summary.totals.readyForCall === 0;

function filterLabel(tenants: Tenant[], tenantId?: string, channel?: Channel): string {
  const parts = [
    tenantId ? (tenants.find((tenant) => tenant.id === tenantId)?.name ?? tenantId) : null,
    channel ? copy.channel[channel] : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : copy.summary.allFilters;
}

export function MonthSummary({ month, tenantId, channel, tenants, headingRef, onMonthChange }: MonthSummaryProps) {
  const api = useConsoleApi();
  const fetcher = useCallback(
    (signal: AbortSignal) => api.getSummary({ month, tenantId, channel }, signal),
    [api, month, tenantId, channel],
  );
  const { state, reload } = useApiResource(fetcher);
  const monthName = formatMonth(month);

  return (
    <section
      aria-labelledby="console-summary-heading"
      aria-busy={state.status === 'loading'}
      className="border-b border-regla px-4 py-4 lg:px-8 lg:py-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="console-summary-heading" ref={headingRef} tabIndex={-1} className="font-display text-xl lg:text-2xl">
          {copy.summary.heading(monthName)}
        </h2>
        <label className="flex items-center gap-3">
          <span className="eyebrow">{copy.summary.monthLabel}</span>
          <select
            className="console-field w-auto"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
          >
            {lastTwelveMonths().map((key) => (
              <option key={key} value={key}>
                {formatMonth(key)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        {state.status === 'loading' && <ZoneStatus kind="loading" lines={3} />}
        {state.status === 'error' && <ZoneStatus kind="error" error={state.error} onRetry={reload} />}
        {state.status === 'ready' && isEmpty(state.data) && (
          <ZoneStatus kind="empty" message={copy.summary.empty(monthName)} />
        )}
        {state.status === 'ready' && !isEmpty(state.data) && (
          <>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
              <Figure label={copy.summary.labels.conversations} value={formatCount(state.data.totals.conversations)} />
              <Figure label={copy.summary.labels.replies} value={formatCount(state.data.totals.replies)} />
              <Figure label={copy.summary.labels.cost} value={formatCost(state.data.totals.costUsd)} />
              <Figure label={copy.summary.labels.ready} value={formatCount(state.data.totals.readyForCall)} />
            </dl>
            <p className="tabular mt-3 text-xs text-tinta-media">{filterLabel(tenants, tenantId, channel)}</p>
            <DailyChart summary={state.data} />
          </>
        )}
      </div>
    </section>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="tabular text-2xl lg:text-4xl">{value}</dd>
    </div>
  );
}
