import type {
  ConversationDetail,
  ConversationSummary,
  MonthKey,
  MonthSummary,
  SessionInfo,
  Signal,
  Tenant,
} from '../types';
import { daysInMonth } from '../lib/month';

export const TENANTS: Tenant[] = [
  { id: 'aiworks', name: 'AIworks' },
  { id: 'demo-panaderia', name: 'Panadería Sol' },
  { id: 'demo-taller', name: 'Taller Ejemplo' },
];

export const SESSION: SessionInfo = { user: 'demo', tenants: TENANTS };

export function summaryRow(id: string, overrides: Partial<ConversationSummary> = {}): ConversationSummary {
  return {
    id,
    tenantId: 'aiworks',
    channel: 'whatsapp',
    contact: '+593 ••• ••• 001',
    createdAt: '2026-10-12T15:04:09Z',
    lastActivityAt: '2026-10-12T15:19:40Z',
    turns: 5,
    signalsReached: 2,
    signalsTotal: 4,
    readyForCall: false,
    ...overrides,
  };
}

export const SIGNALS: Signal[] = [
  { key: 'necesidad', label: 'Necesidad clara', reached: true },
  { key: 'presupuesto', label: 'Presupuesto', reached: false },
  { key: 'plazo', label: 'Plazo definido', reached: true },
  { key: 'contacto', label: 'Datos de contacto', reached: false },
];

export function detail(id: string, overrides: Partial<ConversationDetail> = {}): ConversationDetail {
  const { signalsReached, signalsTotal, ...base } = summaryRow(id);
  void signalsReached;
  void signalsTotal;
  return {
    ...base,
    language: 'es',
    signals: SIGNALS,
    messages: [
      { speaker: 'visitor', text: 'Hola, ¿a qué hora abren?', at: '2026-10-12T15:04:09Z' },
      { speaker: 'assistant', text: 'Atendemos de 8:00 a 18:00.', at: '2026-10-12T15:04:12Z' },
    ],
    ...overrides,
  };
}

export function summaryOf(month: MonthKey, perDay: number[], overrides: Partial<MonthSummary['totals']> = {}): MonthSummary {
  const days = daysInMonth(month).slice(0, perDay.length);
  const total = perDay.reduce((sum, n) => sum + n, 0);
  return {
    month,
    totals: { conversations: total, replies: total * 4, costUsd: 0.0421, readyForCall: 1, ...overrides },
    days: days.map((day, i) => ({ day, conversations: perDay[i] })),
  };
}

export function manyRows(count: number, overrides: Partial<ConversationSummary> = {}): ConversationSummary[] {
  return Array.from({ length: count }, (_, i) => summaryRow(`c${i + 1}`, overrides));
}
