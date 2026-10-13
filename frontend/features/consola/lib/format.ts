import type { MonthKey } from '../types';
import { CONSOLE_TIME_ZONE, dayOf } from './month';

export { CONSOLE_TIME_ZONE };
export const CONSOLE_LOCALE = 'es-EC';

const OPTIONS = { timeZone: CONSOLE_TIME_ZONE } as const;

const monthName = new Intl.DateTimeFormat(CONSOLE_LOCALE, { ...OPTIONS, month: 'long' });
const dayLabel = new Intl.DateTimeFormat(CONSOLE_LOCALE, { ...OPTIONS, day: 'numeric', month: 'short' });
const timeLabel = new Intl.DateTimeFormat(CONSOLE_LOCALE, {
  ...OPTIONS,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
const countLabel = new Intl.NumberFormat(CONSOLE_LOCALE, { useGrouping: 'always' });
const costLabel = new Intl.NumberFormat(CONSOLE_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Noon UTC on the 15th is the 15th in Guayaquil too, so the zone cannot shift the month.
const noonOf = (day: string) => new Date(`${day}T12:00:00Z`);

export function formatMonth(month: MonthKey): string {
  return `${monthName.format(noonOf(`${month}-15`))} ${month.slice(0, 4)}`;
}

export function formatDay(day: string): string {
  return dayLabel.format(noonOf(day)).replace('.', '');
}

export function formatTime(iso: string): string {
  return timeLabel.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDay(dayOf(iso))} · ${formatTime(iso)}`;
}

export function formatCount(value: number): string {
  return countLabel.format(value);
}

export function formatCost(value: number): string {
  if (value > 0 && value < 0.005) return '< 0,01';
  return costLabel.format(value);
}

export const HIDDEN_CONTACT = 'Contacto oculto';

// Defence in depth: the engine already masks phone numbers.
export function safeContact(contact: string): string {
  return /\d{7,}/.test(contact.replace(/[\s\-.()+]/g, '')) ? HIDDEN_CONTACT : contact;
}
