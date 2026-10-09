#!/usr/bin/env node
// Mock of the chat API for landing development. Plain Node, no dependencies.
// Implements the contract of changes/chatbot-web-e9 (contratos-implementacion.md section 6):
//   POST /chat/:tenant        {sesion_id?, mensaje, idioma} -> {sesion_id, respuesta, accion}
//   GET  /chat/:tenant/info   -> {nombre_negocio, tipo, vence}
//
// Usage: node scripts/mock-chat-api.mjs [port]   (default 8000, or env MOCK_PORT)
// Trigger words in the message: "agendar" returns a WhatsApp action with a code, "limite"
// a 429, "falla" a 500, "lento" takes 25 s (exercises the 20 s timeout). A tenant containing
// "nohay" gets a 404 on /info (expired or missing demo).
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.argv[2] ?? process.env.MOCK_PORT ?? 8000);
const LATENCY_MS = 700;
const WA = 'https://wa.me/593978923586';

const isLocal = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin ?? '');

function buildHeaders(req, extraHeaders = {}) {
  const origin = req.headers.origin;
  const cors = isLocal(origin)
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
      }
    : {};
  return { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extraHeaders };
}

function respond(req, res, status, body) {
  res.writeHead(status, buildHeaders(req));
  res.end(JSON.stringify(body));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 20_000) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch (e) {
        reject(e);
      }
    });
  });
}

function replyText(message, language, tenant) {
  const lower = message.toLowerCase();
  const en = language === 'en';
  if (tenant.startsWith('demo-')) {
    return en
      ? 'We are open Monday to Saturday, 8:00 to 18:00. (Sample reply from the mock server.)'
      : 'Atendemos de lunes a sábado, de 8:00 a 18:00. (Respuesta de ejemplo del server simulado.)';
  }
  if (/cuesta|precio|cost|price/.test(lower)) {
    return en
      ? 'The WhatsApp assistant has a one-time setup of USD 300 + VAT (founder price) and plans from USD 45 + VAT per month. Official values go in the quote.'
      : 'El asistente de WhatsApp tiene una instalación de USD 300 + IVA (precio de fundador) y planes desde USD 45 + IVA al mes. Los valores oficiales van en la proforma.';
  }
  if (/medida|custom/.test(lower)) {
    return en
      ? 'A custom system is software built around one of your processes, for example reconciling bank statements, with human review and a record of every decision.\n\nWe start with a free 15-minute assessment.'
      : 'Un sistema a medida es software construido alrededor de uno de sus procesos, por ejemplo conciliar extractos bancarios, con revisión humana y registro de cada decisión.\n\nEmpezamos con un diagnóstico de 15 minutos sin costo.';
  }
  return en
    ? 'Hi! I am the AIworks assistant. Ask me what we build, what it costs, or say you want to book a call.'
    : 'Buenos días. Soy el asistente de AIworks. Pregúnteme qué construimos, cuánto cuesta, o dígame si quiere agendar una llamada.';
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, buildHeaders(req));
    return res.end();
  }
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] !== 'chat' || !parts[1]) return respond(req, res, 404, { detail: 'Not found' });
  const tenant = decodeURIComponent(parts[1]);

  if (req.method === 'GET' && parts[2] === 'info' && parts.length === 3) {
    if (tenant === 'aiworks') return respond(req, res, 200, { nombre_negocio: 'AIworks', tipo: 'cliente', vence: null });
    if (tenant.startsWith('demo-') && !tenant.includes('nohay')) {
      const expires = new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10);
      return respond(req, res, 200, { nombre_negocio: 'Panadería Sol', tipo: 'demo', vence: expires });
    }
    return respond(req, res, 404, { detail: 'Unavailable' });
  }

  if (req.method === 'POST' && parts.length === 2) {
    let data;
    try {
      data = await readBody(req);
    } catch {
      return respond(req, res, 400, { detail: 'Invalid JSON' });
    }
    const message = typeof data.mensaje === 'string' ? data.mensaje : '';
    const language = data.idioma === 'en' ? 'en' : 'es';
    if (!message.trim()) return respond(req, res, 422, { detail: 'empty message' });
    const lower = message.toLowerCase();

    await sleep(LATENCY_MS);
    if (lower.includes('lento')) await sleep(25_000);
    if (lower.includes('limite')) {
      return respond(req, res, 429, {
        respuesta: language === 'en' ? 'Too many messages.' : 'Demasiados mensajes.',
        accion: { tipo: 'whatsapp', url: WA, codigo: null },
      });
    }
    if (lower.includes('falla')) return respond(req, res, 500, { detail: 'Simulated error' });

    const sessionId = typeof data.sesion_id === 'string' && data.sesion_id ? data.sesion_id : randomUUID();
    if (lower.includes('agendar') || lower.includes('book a call')) {
      const code = 'W-7K3F';
      return respond(req, res, 200, {
        sesion_id: sessionId,
        respuesta:
          language === 'en'
            ? 'Great. Continue on WhatsApp and we will agree on a time for the call.'
            : 'Perfecto. Continúe por WhatsApp y acordamos el horario de la llamada.',
        accion: { tipo: 'whatsapp', url: `${WA}?text=${encodeURIComponent(`Hola, quiero agendar una llamada. Código ${code}`)}`, codigo: code },
      });
    }
    return respond(req, res, 200, { sesion_id: sessionId, respuesta: replyText(message, language, tenant), accion: null });
  }

  respond(req, res, 404, { detail: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AIworks chat mock at http://127.0.0.1:${PORT}`);
});
