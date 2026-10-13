import type {
  Channel,
  ConversationDetail,
  ConversationPage,
  ConversationSummary,
  MonthSummary,
  Signal,
  SessionInfo,
} from '../types';

export interface WireSession {
  usuario: string;
  tenants: { id: string; nombre: string }[];
}

export interface WireSummary {
  mes: string;
  totales: { conversaciones: number; respuestas: number; costo_usd: number; listas_para_llamada: number };
  por_dia: { dia: string; conversaciones: number }[];
}

export interface WireConversationSummary {
  id: string;
  tenant: string;
  canal: 'web' | 'whatsapp';
  contacto: string;
  creada: string;
  ultima_actividad: string;
  turnos: number;
  senales_alcanzadas: number;
  senales_total: number;
  lista_para_llamada: boolean;
}

export interface WirePage {
  elementos: WireConversationSummary[];
  siguiente: string | null;
}

export interface WireConversationDetail
  extends Omit<WireConversationSummary, 'senales_alcanzadas' | 'senales_total'> {
  idioma: 'es' | 'en' | null;
  senales: { clave: string; nombre: string; alcanzada: boolean }[];
  mensajes: { rol: 'visitante' | 'asistente'; texto: string; momento: string }[];
}

export interface WireError {
  detail: { codigo: string; mensaje: string; reintentar_en?: number };
}

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isStr = (value: unknown): value is string => typeof value === 'string';
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;
const isAmount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isChannel = (value: unknown): value is Channel => value === 'web' || value === 'whatsapp';

function parseSummaryRow(value: unknown): ConversationSummary | null {
  if (!isObj(value)) return null;
  const v = value;
  if (
    !isStr(v.id) || !isStr(v.tenant) || !isChannel(v.canal) || !isStr(v.contacto) ||
    !isStr(v.creada) || !isStr(v.ultima_actividad) || !isCount(v.turnos) ||
    !isCount(v.senales_alcanzadas) || !isCount(v.senales_total) ||
    v.senales_alcanzadas > v.senales_total || typeof v.lista_para_llamada !== 'boolean'
  ) {
    return null;
  }
  return {
    id: v.id,
    tenantId: v.tenant,
    channel: v.canal,
    contact: v.contacto,
    createdAt: v.creada,
    lastActivityAt: v.ultima_actividad,
    turns: v.turnos,
    signalsReached: v.senales_alcanzadas,
    signalsTotal: v.senales_total,
    readyForCall: v.lista_para_llamada,
  };
}

export function parseSession(body: unknown): SessionInfo | null {
  if (!isObj(body) || !isStr(body.usuario) || !Array.isArray(body.tenants)) return null;
  const tenants: SessionInfo['tenants'] = [];
  for (const item of body.tenants) {
    if (!isObj(item) || !isStr(item.id) || !isStr(item.nombre)) return null;
    tenants.push({ id: item.id, name: item.nombre });
  }
  return { user: body.usuario, tenants };
}

export function parseSummary(body: unknown): MonthSummary | null {
  if (!isObj(body) || !isStr(body.mes) || !isObj(body.totales) || !Array.isArray(body.por_dia)) {
    return null;
  }
  const t = body.totales;
  if (
    !isCount(t.conversaciones) || !isCount(t.respuestas) ||
    !isAmount(t.costo_usd) || !isCount(t.listas_para_llamada)
  ) {
    return null;
  }
  const days: MonthSummary['days'] = [];
  for (const item of body.por_dia) {
    if (!isObj(item) || !isStr(item.dia) || !isCount(item.conversaciones)) return null;
    days.push({ day: item.dia, conversations: item.conversaciones });
  }
  return {
    month: body.mes,
    totals: {
      conversations: t.conversaciones,
      replies: t.respuestas,
      costUsd: t.costo_usd,
      readyForCall: t.listas_para_llamada,
    },
    days,
  };
}

export function parsePage(body: unknown): ConversationPage | null {
  if (!isObj(body) || !Array.isArray(body.elementos)) return null;
  if (body.siguiente !== null && !isStr(body.siguiente)) return null;
  const items: ConversationSummary[] = [];
  for (const row of body.elementos) {
    const parsed = parseSummaryRow(row);
    if (!parsed) return null;
    items.push(parsed);
  }
  return { items, nextCursor: body.siguiente };
}

export function parseDetail(body: unknown): ConversationDetail | null {
  if (!isObj(body)) return null;
  const b = body;
  if (
    !isStr(b.id) || !isStr(b.tenant) || !isChannel(b.canal) || !isStr(b.contacto) ||
    !isStr(b.creada) || !isStr(b.ultima_actividad) || !isCount(b.turnos) ||
    typeof b.lista_para_llamada !== 'boolean' ||
    !(b.idioma === 'es' || b.idioma === 'en' || b.idioma === null) ||
    !Array.isArray(b.senales) || !Array.isArray(b.mensajes)
  ) {
    return null;
  }
  const signals: Signal[] = [];
  for (const item of b.senales) {
    if (!isObj(item) || !isStr(item.clave) || !isStr(item.nombre) || typeof item.alcanzada !== 'boolean') {
      return null;
    }
    signals.push({ key: item.clave, label: item.nombre, reached: item.alcanzada });
  }
  const messages: ConversationDetail['messages'] = [];
  for (const item of b.mensajes) {
    if (
      !isObj(item) || !(item.rol === 'visitante' || item.rol === 'asistente') ||
      !isStr(item.texto) || !isStr(item.momento)
    ) {
      return null;
    }
    messages.push({
      speaker: item.rol === 'visitante' ? 'visitor' : 'assistant',
      text: item.texto,
      at: item.momento,
    });
  }
  return {
    id: b.id,
    tenantId: b.tenant,
    channel: b.canal,
    contact: b.contacto,
    createdAt: b.creada,
    lastActivityAt: b.ultima_actividad,
    turns: b.turnos,
    readyForCall: b.lista_para_llamada,
    language: b.idioma,
    signals,
    messages,
  };
}

export function parseError(body: unknown): { code: string | null; retryAfterSeconds: number | null } {
  const detail = isObj(body) && isObj(body.detail) ? body.detail : null;
  if (!detail) return { code: null, retryAfterSeconds: null };
  return {
    code: isStr(detail.codigo) ? detail.codigo : null,
    retryAfterSeconds: isCount(detail.reintentar_en) ? detail.reintentar_en : null,
  };
}
