#!/usr/bin/env node
// Servidor simulado de la API del chat, solo para desarrollo de la landing.
// Node puro, sin dependencias. Implementa el contrato de changes/chatbot-web-e9
// (contratos-implementacion.md § 6):
//   POST /chat/:tenant        {sesion_id?, mensaje, idioma} -> {sesion_id, respuesta, accion}
//   GET  /chat/:tenant/info   -> {nombre_negocio, tipo, vence}
//
// Uso:  node scripts/mock-chat-api.mjs [puerto]      (por defecto 8000, o env MOCK_PORT)
// Atajos para probar:
//   mensaje con "agendar"  -> respuesta con `accion` de WhatsApp y código
//   mensaje con "limite"   -> 429
//   mensaje con "falla"    -> 500
//   mensaje con "lento"    -> tarda 25 s (prueba el timeout de 20 s)
//   GET .../demo-nohay.../info  -> 404 (demo vencida o inexistente)
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PUERTO = Number(process.argv[2] ?? process.env.MOCK_PORT ?? 8000);
const LATENCIA_MS = 700;
const WA = 'https://wa.me/593978923586';

const esLocal = (origen) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origen ?? '');

function cabeceras(req, extra = {}) {
  const origen = req.headers.origin;
  const cors = esLocal(origen)
    ? {
        'Access-Control-Allow-Origin': origen,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
      }
    : {};
  return { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra };
}

function responder(req, res, estado, cuerpo) {
  res.writeHead(estado, cabeceras(req));
  res.end(JSON.stringify(cuerpo));
}

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (c) => {
      datos += c;
      if (datos.length > 20_000) reject(new Error('demasiado grande'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(datos || '{}'));
      } catch (e) {
        reject(e);
      }
    });
  });
}

function textoRespuesta(mensaje, idioma, tenant) {
  const m = mensaje.toLowerCase();
  const en = idioma === 'en';
  if (tenant.startsWith('demo-')) {
    return en
      ? 'We are open Monday to Saturday, 8:00 to 18:00. (Sample reply from the mock server.)'
      : 'Atendemos de lunes a sábado, de 8:00 a 18:00. (Respuesta de ejemplo del servidor simulado.)';
  }
  if (/cuesta|precio|cost|price/.test(m)) {
    return en
      ? 'The WhatsApp assistant has a one-time setup of USD 300 + VAT (founder price) and plans from USD 45 + VAT per month. Official values go in the quote.'
      : 'El asistente de WhatsApp tiene una instalación de USD 300 + IVA (precio de fundador) y planes desde USD 45 + IVA al mes. Los valores oficiales van en la proforma.';
  }
  if (/medida|custom/.test(m)) {
    return en
      ? 'A custom system is software built around one of your processes, for example reconciling bank statements, with human review and a record of every decision.\n\nWe start with a free 15-minute assessment.'
      : 'Un sistema a medida es software construido alrededor de uno de sus procesos, por ejemplo conciliar extractos bancarios, con revisión humana y registro de cada decisión.\n\nEmpezamos con un diagnóstico de 15 minutos sin costo.';
  }
  return en
    ? 'Hi! I am the AIworks assistant. Ask me what we build, what it costs, or say you want to book a call.'
    : 'Buenos días. Soy el asistente de AIworks. Pregúnteme qué construimos, cuánto cuesta, o dígame si quiere agendar una llamada.';
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cabeceras(req));
    return res.end();
  }
  const partes = url.pathname.split('/').filter(Boolean); // ['chat', tenant, 'info'?]
  if (partes[0] !== 'chat' || !partes[1]) return responder(req, res, 404, { detail: 'No existe' });
  const tenant = decodeURIComponent(partes[1]);

  // GET /chat/:tenant/info
  if (req.method === 'GET' && partes[2] === 'info' && partes.length === 3) {
    if (tenant === 'aiworks') return responder(req, res, 200, { nombre_negocio: 'AIworks', tipo: 'cliente', vence: null });
    if (tenant.startsWith('demo-') && !tenant.includes('nohay')) {
      const vence = new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10);
      return responder(req, res, 200, { nombre_negocio: 'Panadería Sol', tipo: 'demo', vence });
    }
    return responder(req, res, 404, { detail: 'No disponible' });
  }

  // POST /chat/:tenant
  if (req.method === 'POST' && partes.length === 2) {
    let datos;
    try {
      datos = await leerCuerpo(req);
    } catch {
      return responder(req, res, 400, { detail: 'JSON inválido' });
    }
    const mensaje = typeof datos.mensaje === 'string' ? datos.mensaje : '';
    const idioma = datos.idioma === 'en' ? 'en' : 'es';
    if (!mensaje.trim()) return responder(req, res, 422, { detail: 'mensaje vacío' });
    const m = mensaje.toLowerCase();

    await pausa(LATENCIA_MS);
    if (m.includes('lento')) await pausa(25_000);
    if (m.includes('limite')) {
      return responder(req, res, 429, {
        respuesta: idioma === 'en' ? 'Too many messages.' : 'Demasiados mensajes.',
        accion: { tipo: 'whatsapp', url: WA, codigo: null },
      });
    }
    if (m.includes('falla')) return responder(req, res, 500, { detail: 'Error simulado' });

    const sesion_id = typeof datos.sesion_id === 'string' && datos.sesion_id ? datos.sesion_id : randomUUID();
    if (m.includes('agendar') || m.includes('book a call')) {
      const codigo = 'W-7K3F';
      return responder(req, res, 200, {
        sesion_id,
        respuesta:
          idioma === 'en'
            ? 'Great. Continue on WhatsApp and we will agree on a time for the call.'
            : 'Perfecto. Continúe por WhatsApp y acordamos el horario de la llamada.',
        accion: { tipo: 'whatsapp', url: `${WA}?text=${encodeURIComponent(`Hola, quiero agendar una llamada. Código ${codigo}`)}`, codigo },
      });
    }
    return responder(req, res, 200, { sesion_id, respuesta: textoRespuesta(mensaje, idioma, tenant), accion: null });
  }

  responder(req, res, 404, { detail: 'No existe' });
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`Mock del chat de AIworks en http://127.0.0.1:${PUERTO}`);
});
