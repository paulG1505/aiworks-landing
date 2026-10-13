import { afterEach, describe, expect, it, vi } from 'vitest';
import { currentMonth, dayOf, daysInMonth, isMonthKey, lastTwelveMonths } from './month';

afterEach(() => vi.useRealTimers());

describe('month helpers', () => {
  it('counts a chat created at 2026-10-01T03:00Z on day 2026-09-30 in Guayaquil', () => {
    expect(dayOf('2026-10-01T03:00:00Z')).toBe('2026-09-30');
    expect(dayOf('2026-10-01T05:00:00Z')).toBe('2026-10-01');
    expect(currentMonth(new Date('2026-10-01T03:00:00Z'))).toBe('2026-09');
  });

  it('uses the system clock when no date is given', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
    expect(currentMonth()).toBe('2026-10');
  });

  it('lists the last twelve months with the current one first', () => {
    const months = lastTwelveMonths(new Date('2026-02-10T12:00:00Z'));
    expect(months).toHaveLength(12);
    expect(months[0]).toBe('2026-02');
    expect(months[1]).toBe('2026-01');
    expect(months[2]).toBe('2025-12');
    expect(months[11]).toBe('2025-03');
  });

  it('validates month keys', () => {
    for (const valid of ['2026-10', '2020-01']) expect(isMonthKey(valid)).toBe(true);
    for (const invalid of ['2026-13', '2026-00', '26-10', '2026-1', '2026-10-01', '']) {
      expect(isMonthKey(invalid)).toBe(false);
    }
  });

  it('lists the days of a month, including leap years', () => {
    const october = daysInMonth('2026-10');
    expect(october).toHaveLength(31);
    expect(october[0]).toBe('2026-10-01');
    expect(october[30]).toBe('2026-10-31');
    expect(daysInMonth('2028-02')).toHaveLength(29);
    expect(daysInMonth('2026-02')).toHaveLength(28);
  });
});
