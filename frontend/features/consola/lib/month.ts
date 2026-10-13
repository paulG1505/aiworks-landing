import type { MonthKey } from '../types';

export const CONSOLE_TIME_ZONE = 'America/Guayaquil';

const MONTH_KEY = /^(\d{4})-(0[1-9]|1[0-2])$/;

const dayParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: CONSOLE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** 'YYYY-MM-DD' of an instant, in America/Guayaquil. */
export function dayOf(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const parts = Object.fromEntries(dayParts.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function currentMonth(now: Date = new Date()): MonthKey {
  return dayOf(now).slice(0, 7);
}

export function isMonthKey(value: string): boolean {
  return MONTH_KEY.test(value);
}

export function lastTwelveMonths(now: Date = new Date()): MonthKey[] {
  const [year, month] = currentMonth(now).split('-').map(Number);
  return Array.from({ length: 12 }, (_, i) => {
    const index = year * 12 + (month - 1) - i;
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
  });
}

export function daysInMonth(month: MonthKey): string[] {
  const [year, monthNumber] = month.split('-').map(Number);
  const count = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}
