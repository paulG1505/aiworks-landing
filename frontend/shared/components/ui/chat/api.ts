import { CONTACT_INFO } from '@/shared/constants';

// The only public variable. Development defaults to the local server (or the mock in
// `scripts/mock-chat-api.mjs`); no secret ever reaches the browser.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://api.aiworks.lat')
).replace(/\/+$/, '');

export const MAX_CHARS = 1000;
export const TIMEOUT_MS = 20_000;

export interface ChatAction {
  type: 'whatsapp';
  url: string;
  code: string | null;
}

export type ChatResult =
  | { ok: true; sessionId: string | null; reply: string; action: ChatAction | null }
  | { ok: false; reason: 'limit' | 'timeout' | 'network' | 'error' };

// Only wa.me actions are accepted: nothing coming from the network may open another destination.
function normalizeAction(value: unknown): ChatAction | null {
  if (!value || typeof value !== 'object') return null;
  const { tipo, url, codigo } = value as Record<string, unknown>;
  if (tipo !== 'whatsapp' || typeof url !== 'string' || !url.startsWith('https://wa.me/')) return null;
  return { type: 'whatsapp', url, code: typeof codigo === 'string' && codigo ? codigo : null };
}

export async function sendMessage(
  tenant: string,
  data: { sessionId: string | null; message: string; language: string },
  signal?: AbortSignal,
): Promise<ChatResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller);

  try {
    const response = await fetch(`${API_URL}/chat/${tenant}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(data.sessionId ? { sesion_id: data.sessionId } : {}),
        mensaje: data.message,
        idioma: data.language,
      }),
      signal: controller.signal,
    });
    if (response.status === 429) return { ok: false, reason: 'limit' };
    if (!response.ok) return { ok: false, reason: 'error' };
    const body = (await response.json()) as Record<string, unknown>;
    if (typeof body.respuesta !== 'string' || !body.respuesta) return { ok: false, reason: 'error' };
    return {
      ok: true,
      sessionId: typeof body.sesion_id === 'string' ? body.sesion_id : null,
      reply: body.respuesta,
      action: normalizeAction(body.accion),
    };
  } catch {
    return { ok: false, reason: timedOut ? 'timeout' : 'network' };
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export interface TenantInfo {
  businessName: string;
  type: string;
  expires: string | null;
}

export type InfoResult =
  | { status: 'ok'; info: TenantInfo }
  | { status: 'unavailable' }
  | { status: 'error' };

export async function fetchTenantInfo(tenant: string, signal?: AbortSignal): Promise<InfoResult> {
  try {
    const response = await fetch(`${API_URL}/chat/${tenant}/info`, { signal });
    if (response.status === 404) return { status: 'unavailable' };
    if (!response.ok) return { status: 'error' };
    const body = (await response.json()) as Record<string, unknown>;
    if (typeof body.nombre_negocio !== 'string') return { status: 'error' };
    return {
      status: 'ok',
      info: {
        businessName: body.nombre_negocio,
        type: typeof body.tipo === 'string' ? body.tipo : 'demo',
        expires: typeof body.vence === 'string' ? body.vence : null,
      },
    };
  } catch {
    return { status: 'error' };
  }
}

const sessionKey = (tenant: string) => `aiworks-chat-${tenant}`;

// sessionStorage can throw (private window, blocked data), so every access is in try/catch.
export function readSession(tenant: string): string | null {
  try {
    return sessionStorage.getItem(sessionKey(tenant));
  } catch {
    return null;
  }
}

export function saveSession(tenant: string, id: string) {
  try {
    sessionStorage.setItem(sessionKey(tenant), id);
  } catch {
    // Without storage the conversation lasts while the page stays open.
  }
}

export const WHATSAPP_FALLBACK_URL = `https://wa.me/${CONTACT_INFO.whatsapp}`;
