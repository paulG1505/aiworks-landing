'use client';

import { useState, type KeyboardEvent } from 'react';
import { copy } from '../copy';
import { formatDay, formatMonth } from '../lib/format';
import { daysInMonth } from '../lib/month';
import type { MonthSummary } from '../types';

const MAX_MARK_HEIGHT_PX = 48;

export function DailyChart({ summary }: { summary: MonthSummary }) {
  const [active, setActive] = useState<number | null>(null);
  const days = daysInMonth(summary.month);
  const counts = days.map((day) => summary.days.find((entry) => entry.day === day)?.conversations ?? 0);
  const max = Math.max(...counts);
  const busiest = counts.indexOf(max);

  function onKeyDown(event: KeyboardEvent) {
    const last = days.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = active === null ? 0 : Math.min(active + 1, last);
    else if (event.key === 'ArrowLeft') next = active === null ? 0 : Math.max(active - 1, 0);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
  }

  let reading: string = copy.summary.chart.none;
  if (active !== null) reading = copy.summary.chart.day(formatDay(days[active]), counts[active]);
  else if (max > 0) reading = copy.summary.chart.busiest(formatDay(days[busiest]), max);

  return (
    <div className="mt-6">
      <div
        role="group"
        aria-label={copy.summary.chart.label(formatMonth(summary.month))}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex h-[3.75rem] items-end border-b border-regla"
      >
        {days.map((day, i) => (
          <div
            key={day}
            data-day={day}
            onMouseEnter={() => setActive(i)}
            className="relative flex h-full flex-1 items-end justify-center"
          >
            {counts[i] > 0 && (
              <span
                data-mark=""
                className="block w-[2px] bg-marca"
                style={{ height: `${Math.max(2, Math.round((counts[i] / max) * MAX_MARK_HEIGHT_PX))}px` }}
              />
            )}
            {active === i && <span aria-hidden="true" className="absolute -bottom-[7px] h-[5px] w-[2px] bg-tinta" />}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="tabular mt-3 text-sm text-tinta-media">
        {reading}
      </p>
    </div>
  );
}
