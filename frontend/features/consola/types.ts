export type Channel = 'web' | 'whatsapp';
/** 'YYYY-MM' in America/Guayaquil. */
export type MonthKey = string;

export interface Tenant {
  id: string;
  name: string;
}

export interface SessionInfo {
  user: string;
  tenants: Tenant[];
}

export interface LoginCredentials {
  user: string;
  password: string;
  /** Exactly 6 digits. */
  code: string;
}

export interface SummaryTotals {
  conversations: number;
  replies: number;
  costUsd: number;
  readyForCall: number;
}

export interface DailyCount {
  /** 'YYYY-MM-DD' in America/Guayaquil. */
  day: string;
  conversations: number;
}

export interface MonthSummary {
  month: MonthKey;
  totals: SummaryTotals;
  days: DailyCount[];
}

export interface SummaryQuery {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
}

export interface ConversationSummary {
  id: string;
  tenantId: string;
  channel: Channel;
  contact: string;
  /** ISO 8601 UTC. */
  createdAt: string;
  lastActivityAt: string;
  turns: number;
  signalsReached: number;
  signalsTotal: number;
  readyForCall: boolean;
}

export interface ConversationPage {
  items: ConversationSummary[];
  /** Opaque; null when there are no more pages. */
  nextCursor: string | null;
}

export interface ConversationQuery {
  month: MonthKey;
  tenantId?: string;
  channel?: Channel;
  readyOnly?: boolean;
  cursor?: string;
  limit?: number;
}

export type Speaker = 'visitor' | 'assistant';

export interface Message {
  speaker: Speaker;
  text: string;
  at: string;
}

export interface Signal {
  key: string;
  label: string;
  reached: boolean;
}

export interface ConversationDetail {
  id: string;
  tenantId: string;
  channel: Channel;
  contact: string;
  createdAt: string;
  lastActivityAt: string;
  turns: number;
  readyForCall: boolean;
  language: 'es' | 'en' | null;
  signals: Signal[];
  messages: Message[];
}

export type ConsoleErrorKind =
  | 'unauthorized'     // 401
  | 'forbidden'        // 403
  | 'not_found'        // 404
  | 'invalid_request'  // 400, 405, 422
  | 'rate_limited'     // 429
  | 'server'           // 5xx and any other non-2xx
  | 'timeout'          // no answer within REQUEST_TIMEOUT_MS
  | 'network'          // fetch rejected (offline, DNS, CORS)
  | 'aborted'          // the caller aborted; ignore the result
  | 'bad_response';    // 2xx whose body does not match the contract

export interface ConsoleError {
  kind: ConsoleErrorKind;
  status: number | null;
  /** detail.codigo from the body, when present. */
  code: string | null;
  /** Only for rate_limited: detail.reintentar_en, else Retry-After, else 60. */
  retryAfterSeconds: number | null;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ConsoleError };
