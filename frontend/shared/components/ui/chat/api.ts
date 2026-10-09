import { CONTACT_INFO } from '@/shared/constants';

/**
 * Única variable pública: la URL de la API. En desarrollo apunta al servidor local (o al
 * mock de `scripts/mock-chat-api.mjs`); en producción, a api.aiworks.lat. Ningún secreto
 * vive en el navegador: la clave del modelo y el token de Notion se quedan en el servidor.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://api.aiworks.lat')
).replace(/\/+$/, '');

export const MAX_CARACTERES = 1000;
export const TIMEOUT_MS = 20_000;

export interface AccionChat {
  tipo: 'whatsapp';
  url: string;
  codigo: string | null;
}

export type ResultadoChat =
  | { ok: true; sesionId: string | null; respuesta: string; accion: AccionChat | null }
  | { ok: false; motivo: 'limite' | 'timeout' | 'red' | 'error' };

/** Solo se acepta una acción hacia wa.me: nada que venga de la red abre otro destino. */
function normalizarAccion(valor: unknown): AccionChat | null {
  if (!valor || typeof valor !== 'object') return null;
  const { tipo, url, codigo } = valor as Record<string, unknown>;
  if (tipo !== 'whatsapp' || typeof url !== 'string' || !url.startsWith('https://wa.me/')) return null;
  return { tipo: 'whatsapp', url, codigo: typeof codigo === 'string' && codigo ? codigo : null };
}

export async function enviarMensaje(
  tenant: string,
  datos: { sesionId: string | null; mensaje: string; idioma: string },
  senal?: AbortSignal,
): Promise<ResultadoChat> {
  const control = new AbortController();
  let vencio = false;
  const temporizador = window.setTimeout(() => {
    vencio = true;
    control.abort();
  }, TIMEOUT_MS);
  const cancelar = () => control.abort();
  senal?.addEventListener('abort', cancelar);

  try {
    const respuesta = await fetch(`${API_URL}/chat/${tenant}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(datos.sesionId ? { sesion_id: datos.sesionId } : {}),
        mensaje: datos.mensaje,
        idioma: datos.idioma,
      }),
      signal: control.signal,
    });
    if (respuesta.status === 429) return { ok: false, motivo: 'limite' };
    if (!respuesta.ok) return { ok: false, motivo: 'error' };
    const cuerpo = (await respuesta.json()) as Record<string, unknown>;
    if (typeof cuerpo.respuesta !== 'string' || !cuerpo.respuesta) return { ok: false, motivo: 'error' };
    return {
      ok: true,
      sesionId: typeof cuerpo.sesion_id === 'string' ? cuerpo.sesion_id : null,
      respuesta: cuerpo.respuesta,
      accion: normalizarAccion(cuerpo.accion),
    };
  } catch {
    return { ok: false, motivo: vencio ? 'timeout' : 'red' };
  } finally {
    window.clearTimeout(temporizador);
    senal?.removeEventListener('abort', cancelar);
  }
}

export interface InfoTenant {
  nombre_negocio: string;
  tipo: string;
  vence: string | null;
}

export type ResultadoInfo =
  | { estado: 'ok'; info: InfoTenant }
  | { estado: 'no-disponible' }
  | { estado: 'error' };

export async function pedirInfo(tenant: string, senal?: AbortSignal): Promise<ResultadoInfo> {
  try {
    const respuesta = await fetch(`${API_URL}/chat/${tenant}/info`, { signal: senal });
    if (respuesta.status === 404) return { estado: 'no-disponible' };
    if (!respuesta.ok) return { estado: 'error' };
    const cuerpo = (await respuesta.json()) as Record<string, unknown>;
    if (typeof cuerpo.nombre_negocio !== 'string') return { estado: 'error' };
    return {
      estado: 'ok',
      info: {
        nombre_negocio: cuerpo.nombre_negocio,
        tipo: typeof cuerpo.tipo === 'string' ? cuerpo.tipo : 'demo',
        vence: typeof cuerpo.vence === 'string' ? cuerpo.vence : null,
      },
    };
  } catch {
    return { estado: 'error' };
  }
}

const claveSesion = (tenant: string) => `aiworks-chat-${tenant}`;

/** sessionStorage puede lanzar (ventana privada, datos bloqueados): siempre en try/catch. */
export function leerSesion(tenant: string): string | null {
  try {
    return sessionStorage.getItem(claveSesion(tenant));
  } catch {
    return null;
  }
}

export function guardarSesion(tenant: string, id: string) {
  try {
    sessionStorage.setItem(claveSesion(tenant), id);
  } catch {
    // Sin almacenamiento, la conversación sigue mientras la página esté abierta.
  }
}

export const URL_WHATSAPP_RESPALDO = `https://wa.me/${CONTACT_INFO.whatsapp}`;
