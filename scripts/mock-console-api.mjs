#!/usr/bin/env node
// Mock of the console API (/console/api) for landing development. Plain Node, no dependencies.
//   POST /console/api/login            {usuario, clave, codigo}  -> Sesion + Set-Cookie
//   POST /console/api/logout           {}                        -> 204
//   GET  /console/api/yo                                         -> Sesion
//   GET  /console/api/resumen?mes=AAAA-MM[&tenant=][&canal=]
//   GET  /console/api/conversaciones?mes=AAAA-MM[&tenant=][&canal=][&listas=1][&cursor=][&limite=]
//   GET  /console/api/conversaciones/:id
// Usage: node scripts/mock-console-api.mjs [port]   (default 8000, or env MOCK_PORT)
//   Open the landing at http://127.0.0.1:3000/consola (not localhost: the cookie would not travel).
//   Login: demo / consola-demo / 123456. User "bloqueado" -> 429 at once; 5 failures -> 429 for 60 s.
//   Env: MOCK_IDLE_SECONDS=1800 (idle expiry), MOCK_DISABLED=1 (every route 404), MOCK_EMPTY=1 (no data).
//   Months: current has data; previous has figures but an empty list; two months ago /resumen -> 500;
//   three months ago /resumen takes 20 s (client timeout); older ones are empty.
//   Conversations: c_caduca (first read -> 401), c_falla (500), c_lenta (20 s), c_purgada (404),
//   c_numero (full phone number, to see "Contacto oculto"). tenant=demo-limite -> 429 on summary and list.
import { createServer } from 'node:http';
import { createHash, randomUUID } from 'node:crypto';

const PORT = Number(process.argv[2] ?? process.env.MOCK_PORT ?? 8000);
const IDLE_MS = Number(process.env.MOCK_IDLE_SECONDS ?? 1800) * 1000;
const DISABLED = process.env.MOCK_DISABLED === '1';
const EMPTY = process.env.MOCK_EMPTY === '1';
const LATENCY_MS = 400;
const COOKIE = 'consola_dev';
const TIME_ZONE = 'America/Guayaquil';
const DEFAULT_PAGE_SIZE = 20;

const USER = { name: 'demo', password: 'consola-demo', code: '123456' };
const TENANTS = [
  { id: 'aiworks', nombre: 'AIworks' },
  { id: 'demo-panaderia', nombre: 'Panadería Sol' },
  { id: 'demo-taller', nombre: 'Taller Ejemplo' },
  { id: 'demo-limite', nombre: 'Tenant de prueba 429' },
].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
const SIGNALS = [
  { clave: 'necesidad', nombre: 'Necesidad clara' },
  { clave: 'presupuesto', nombre: 'Presupuesto' },
  { clave: 'plazo', nombre: 'Plazo definido' },
  { clave: 'contacto', nombre: 'Datos de contacto' },
];

// ---------- dates in America/Guayaquil ----------

const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
const dayOf = (date) => dayFormat.format(date);
const monthOf = (date) => dayOf(date).slice(0, 7);
const shiftMonth = (month, delta) => {
  const [y, m] = month.split('-').map(Number);
  const index = y * 12 + (m - 1) + delta;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
};
// Guayaquil is UTC-5 all year.
const startOfDay = (day) => new Date(`${day}T05:00:00Z`);
const daysOf = (month) => {
  const [y, m] = month.split('-').map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
};

// ---------- deterministic data ----------

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261013);
const pick = (list) => list[Math.floor(rand() * list.length)];
const between = (min, max) => min + Math.floor(rand() * (max - min + 1));

const VISITOR_LINES = [
  'Hola, ¿a qué hora abren?',
  '¿Cuánto cuesta el pan de yuca?',
  'Necesito agendar una cita para revisar mi carro.',
  '¿Tienen servicio a domicilio?',
  '¿Hacen pedidos para fin de semana?',
  'Quisiera saber el precio del cambio de aceite.',
  '¿Aceptan pagos con tarjeta?',
  'Gracias, ¿y los sábados?',
  'Me interesa automatizar las respuestas de mi negocio.',
  '¿Cuánto tiempo toma la instalación?',
];
const ASSISTANT_LINES = [
  'Atendemos de lunes a sábado, de 8:00 a 18:00. (Texto inventado del servidor simulado.)',
  'El pan de yuca cuesta USD 0,25 la unidad. (Dato de ejemplo.)',
  'Con gusto. ¿Qué día le conviene para la cita?',
  'Sí, hacemos entregas en el barrio. Dígame su dirección.',
  'Podemos preparar pedidos con un día de anticipación.',
  'El cambio de aceite parte de USD 25 con mano de obra. (Dato de ejemplo.)',
  'Aceptamos efectivo y tarjeta.',
  'Los sábados abrimos hasta las 14:00.',
  'Podemos ayudarle. ¿Qué preguntas se repiten más en su negocio?',
  'Depende del caso; en el diagnóstico de 15 minutos le damos un plazo concreto.',
];
const LONG_MESSAGE = [
  'Buenas tardes. Le escribo para explicarle con detalle lo que necesitamos, porque es largo.',
  '',
  'Primero: tenemos tres locales y cada uno responde distinto a los clientes.',
  'Segundo: queremos que las respuestas sobre horarios y precios sean siempre las mismas.',
  'Tercero: esta es la dirección de referencia https://ejemplo.test/sucursal?id=123&ref=consola que no debe ser un enlace.',
  '',
  ...Array.from({ length: 12 }, (_, i) => `Línea de relleno ${i + 1}: texto inventado para probar el salto de línea y el desplazamiento del lector.`),
].join('\n').padEnd(1500, ' x').slice(0, 1500);

function buildMessages(createdAt, visitorTurns, { long = false } = {}) {
  const messages = [];
  let at = createdAt.getTime();
  for (let i = 0; i < visitorTurns; i++) {
    const text = long && i === 2 ? LONG_MESSAGE : pick(VISITOR_LINES);
    messages.push({ rol: 'visitante', texto: text, momento: new Date(at).toISOString().replace(/\.\d{3}Z$/, 'Z') });
    at += between(2, 40) * 1000;
    messages.push({ rol: 'asistente', texto: pick(ASSISTANT_LINES), momento: new Date(at).toISOString().replace(/\.\d{3}Z$/, 'Z') });
    at += between(20, 180) * 1000;
  }
  return { messages, lastAt: new Date(at) };
}

const contactOf = (channel) =>
  channel === 'whatsapp'
    ? `+593 ••• ••• ${String(between(0, 99)).padStart(3, '0')}`
    : `web · ${Math.floor(rand() * 0xffffff).toString(16).padStart(6, '0')}`;

const iso = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');
const NOW = new Date();
const CURRENT_MONTH = monthOf(NOW);
const MONTH_START = startOfDay(`${CURRENT_MONTH}-01`);

function makeConversation(id, createdAt, overrides = {}) {
  const channel = overrides.canal ?? pick(['web', 'whatsapp']);
  const turns = overrides.turnos ?? between(1, 6);
  const ready = overrides.lista ?? rand() < 0.14;
  const reached = ready ? SIGNALS.length : between(0, SIGNALS.length - 1);
  const { messages, lastAt } = buildMessages(createdAt, turns, { long: overrides.long });
  return {
    id,
    tenant: overrides.tenant ?? pick(['aiworks', 'demo-panaderia']),
    canal: channel,
    contacto: overrides.contacto ?? contactOf(channel),
    creada: iso(createdAt),
    ultima_actividad: iso(new Date(Math.min(lastAt.getTime(), NOW.getTime()))),
    turnos: turns,
    senales_alcanzadas: reached,
    senales_total: SIGNALS.length,
    lista_para_llamada: ready,
    idioma: pick(['es', 'es', 'es', 'en']),
    messages,
  };
}

const conversations = [];
if (!EMPTY) {
  const spanMs = Math.max(NOW.getTime() - MONTH_START.getTime() - 10 * 60_000, 60_000);
  const created = Array.from({ length: 45 }, () => new Date(MONTH_START.getTime() + Math.floor(rand() * spanMs)));
  created.sort((a, b) => a - b);
  created.forEach((at, i) => {
    // 20 turns = 40 messages; the long message is the visitor's third.
    const special = i === 10 ? { turnos: 20, long: true } : {};
    conversations.push(makeConversation(`c_${String(i + 1).padStart(3, '0')}`, at, special));
  });
  const recent = (minutes) => new Date(Math.max(MONTH_START.getTime(), NOW.getTime() - minutes * 60_000));
  conversations.push(
    makeConversation('c_caduca', recent(1), { tenant: 'aiworks', canal: 'whatsapp', turnos: 3 }),
    makeConversation('c_falla', recent(2), { tenant: 'aiworks', canal: 'web', turnos: 2 }),
    makeConversation('c_lenta', recent(3), { tenant: 'demo-panaderia', canal: 'web', turnos: 2 }),
    makeConversation('c_purgada', recent(4), { tenant: 'demo-panaderia', canal: 'whatsapp', turnos: 2 }),
    makeConversation('c_numero', recent(5), { tenant: 'aiworks', canal: 'whatsapp', turnos: 2, contacto: '+593 99 000 0000' }),
  );
  conversations.sort((a, b) => (a.creada === b.creada ? (a.id < b.id ? 1 : -1) : a.creada < b.creada ? 1 : -1));
}

// Previous month: only counters (the list is empty, as if it had been purged).
const previousMonthRecords = EMPTY
  ? []
  : Array.from({ length: 38 }, () => ({
      tenant: pick(['aiworks', 'demo-panaderia']),
      canal: pick(['web', 'whatsapp']),
      dia: pick(daysOf(shiftMonth(CURRENT_MONTH, -1))),
      lista: rand() < 0.14,
    }));

// ---------- helpers ----------

const sessions = new Map();
let failures = 0;
let blockedUntil = 0;
let expiredOnce = false;
let warnedHost = false;

const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin ?? '');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function corsHeaders(req) {
  const origin = req.headers.origin;
  if (!isLocalOrigin(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Expose-Headers': 'Retry-After',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

function send(req, res, status, body, extra = {}) {
  const headers = { 'Cache-Control': 'no-store', ...corsHeaders(req), ...extra };
  if (body === undefined) {
    res.writeHead(status, headers);
    return res.end();
  }
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

function fail(req, res, status, codigo, mensaje, retryIn) {
  const detail = { codigo, mensaje, ...(retryIn ? { reintentar_en: retryIn } : {}) };
  send(req, res, status, { detail }, retryIn ? { 'Retry-After': String(retryIn) } : {});
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 20_000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve(null);
      }
    });
  });
}

function readToken(req) {
  const match = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(req.headers.cookie ?? '');
  return match?.[1] ?? null;
}

function activeSession(req) {
  const token = readToken(req);
  const last = token ? sessions.get(token) : undefined;
  if (token && last !== undefined && Date.now() - last <= IDLE_MS) {
    sessions.set(token, Date.now());
    return token;
  }
  if (token) sessions.delete(token);
  return null;
}

const sessionBody = () => ({ usuario: USER.name, tenants: TENANTS });

function parseListParams(url, { list }) {
  const q = url.searchParams;
  const month = q.get('mes') ?? '';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month < '2020-01' || month > CURRENT_MONTH) return { error: 'parametro_invalido' };
  const tenant = q.get('tenant');
  if (tenant !== null && !TENANTS.some((t) => t.id === tenant)) return { error: 'parametro_invalido' };
  const channel = q.get('canal');
  if (channel !== null && channel !== 'web' && channel !== 'whatsapp') return { error: 'parametro_invalido' };
  const params = { month, tenant, channel };
  if (list) {
    const ready = q.get('listas');
    if (ready !== null && ready !== '1') return { error: 'parametro_invalido' };
    const limit = q.get('limite') === null ? DEFAULT_PAGE_SIZE : Number(q.get('limite'));
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) return { error: 'parametro_invalido' };
    Object.assign(params, { ready: ready === '1', limit, cursor: q.get('cursor') });
  }
  return params;
}

const filterHash = (p) =>
  createHash('sha1').update(JSON.stringify([p.month, p.tenant, p.channel, p.ready])).digest('hex').slice(0, 12);

const toRow = ({ messages, idioma, ...row }) => row;

// ---------- handlers ----------

async function login(req, res) {
  const origin = req.headers.origin;
  const type = req.headers['content-type'] ?? '';
  if (!isLocalOrigin(origin) || !type.startsWith('application/json')) {
    return fail(req, res, 403, 'origen_no_permitido', 'Origen no permitido.');
  }
  const body = await readJson(req);
  if (!body || typeof body !== 'object') return fail(req, res, 422, 'parametro_invalido', 'Cuerpo inválido.');

  if (body.usuario === 'bloqueado') return fail(req, res, 429, 'bloqueado', 'Demasiados intentos.', 90);
  const left = Math.ceil((blockedUntil - Date.now()) / 1000);
  if (left > 0) return fail(req, res, 429, 'bloqueado', 'Demasiados intentos.', left);

  if (body.usuario === USER.name && body.clave === USER.password && body.codigo === USER.code) {
    failures = 0;
    const token = randomUUID();
    sessions.set(token, Date.now());
    return send(req, res, 200, sessionBody(), {
      'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`,
    });
  }
  failures += 1;
  if (failures >= 5) {
    failures = 0;
    blockedUntil = Date.now() + 60_000;
  }
  return fail(req, res, 401, 'credenciales_invalidas', 'Usuario, clave o código incorrectos.');
}

function logout(req, res) {
  const origin = req.headers.origin;
  const type = req.headers['content-type'] ?? '';
  if (!isLocalOrigin(origin) || !type.startsWith('application/json')) {
    return fail(req, res, 403, 'origen_no_permitido', 'Origen no permitido.');
  }
  const token = readToken(req);
  if (token) sessions.delete(token);
  send(req, res, 204, undefined, { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` });
}

function dailyBuckets(month, rows) {
  const today = dayOf(NOW);
  const days = daysOf(month).filter((day) => day <= today);
  return days.map((dia) => ({ dia, conversaciones: rows.filter((row) => row.dia === dia).length }));
}

async function summary(req, res, url) {
  const p = parseListParams(url, { list: false });
  if (p.error) return fail(req, res, 422, p.error, 'Parámetro inválido.');
  if (p.tenant === 'demo-limite') return fail(req, res, 429, 'demasiadas_peticiones', 'Demasiadas peticiones.', 30);
  if (p.month === shiftMonth(CURRENT_MONTH, -2)) return fail(req, res, 500, 'error_interno', 'Error simulado.');
  if (p.month === shiftMonth(CURRENT_MONTH, -3)) await sleep(20_000);

  let rows = [];
  if (p.month === CURRENT_MONTH) rows = conversations.map((c) => ({ ...c, dia: dayOf(new Date(c.creada)), lista: c.lista_para_llamada }));
  else if (p.month === shiftMonth(CURRENT_MONTH, -1)) rows = previousMonthRecords;
  rows = rows.filter((r) => (!p.tenant || r.tenant === p.tenant) && (!p.channel || r.canal === p.channel));

  const replies = rows.reduce((sum, row) => sum + (row.turnos ?? 3), 0);
  const all = daysOf(p.month);
  const byDay = p.month === CURRENT_MONTH ? dailyBuckets(p.month, rows) : all.map((dia) => ({ dia, conversaciones: rows.filter((r) => r.dia === dia).length }));
  send(req, res, 200, {
    mes: p.month,
    totales: {
      conversaciones: rows.length,
      respuestas: replies,
      costo_usd: Math.round(replies * 0.0035 * 10000) / 10000,
      listas_para_llamada: rows.filter((r) => r.lista).length,
    },
    por_dia: byDay,
  });
}

function list(req, res, url) {
  const p = parseListParams(url, { list: true });
  if (p.error) return fail(req, res, 422, p.error, 'Parámetro inválido.');
  if (p.tenant === 'demo-limite') return fail(req, res, 429, 'demasiadas_peticiones', 'Demasiadas peticiones.', 30);

  let offset = 0;
  if (p.cursor) {
    try {
      const decoded = JSON.parse(Buffer.from(p.cursor, 'base64url').toString('utf8'));
      if (decoded.h !== filterHash(p) || !Number.isInteger(decoded.o) || decoded.o < 0) throw new Error('cursor');
      offset = decoded.o;
    } catch {
      return fail(req, res, 422, 'cursor_invalido', 'Cursor inválido.');
    }
  }
  const rows =
    p.month === CURRENT_MONTH
      ? conversations.filter(
          (c) => (!p.tenant || c.tenant === p.tenant) && (!p.channel || c.canal === p.channel) && (!p.ready || c.lista_para_llamada),
        )
      : [];
  const page = rows.slice(offset, offset + p.limit);
  const next = offset + p.limit < rows.length ? Buffer.from(JSON.stringify({ o: offset + p.limit, h: filterHash(p) })).toString('base64url') : null;
  send(req, res, 200, { elementos: page.map(toRow), siguiente: next });
}

async function detail(req, res, id) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return fail(req, res, 404, 'no_encontrada', 'No existe.');
  if (id === 'c_purgada') return fail(req, res, 404, 'no_encontrada', 'No existe.');
  if (id === 'c_falla') return fail(req, res, 500, 'error_interno', 'Error simulado.');
  if (id === 'c_caduca' && !expiredOnce) {
    expiredOnce = true;
    const token = readToken(req);
    if (token) sessions.delete(token);
    return fail(req, res, 401, 'sin_sesion', 'Sesión caducada.');
  }
  if (id === 'c_lenta') await sleep(20_000);
  const found = conversations.find((c) => c.id === id);
  if (!found) return fail(req, res, 404, 'no_encontrada', 'No existe.');
  const { messages, idioma } = found;
  const { senales_alcanzadas, senales_total, ...base } = toRow(found);
  send(req, res, 200, {
    ...base,
    idioma,
    senales: SIGNALS.slice(0, senales_total).map((signal, i) => ({ ...signal, alcanzada: i < senales_alcanzadas })),
    mensajes: messages,
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const origin = req.headers.origin;
  if (origin && isLocalOrigin(origin) && new URL(origin).hostname !== (req.headers.host ?? '').split(':')[0] && !warnedHost) {
    warnedHost = true;
    console.warn(`[mock] Origin ${origin} vs host ${req.headers.host}: la cookie no viajará: abra la landing en http://127.0.0.1:3000`);
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Cache-Control': 'no-store', ...corsHeaders(req) });
    return res.end();
  }
  await sleep(LATENCY_MS);

  const prefix = '/console/api';
  if (DISABLED || !(url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) {
    return fail(req, res, 404, 'no_encontrada', 'No existe.');
  }
  const parts = url.pathname.slice(prefix.length).split('/').filter(Boolean);
  const route = parts[0];
  const known = ['login', 'logout', 'yo', 'resumen', 'conversaciones'];
  if (!known.includes(route) || parts.length > (route === 'conversaciones' ? 2 : 1)) {
    return fail(req, res, 404, 'no_encontrada', 'No existe.');
  }
  const allowed = ['login', 'logout'].includes(route) ? 'POST' : 'GET';
  if (req.method !== allowed) return fail(req, res, 405, 'metodo_no_permitido', 'Método no permitido.');

  if (route === 'login') return login(req, res);
  if (route === 'logout') return logout(req, res);
  if (!activeSession(req)) return fail(req, res, 401, 'sin_sesion', 'Sesión caducada.');
  if (route === 'yo') return send(req, res, 200, sessionBody());
  if (route === 'resumen') return summary(req, res, url);
  if (parts[1]) return detail(req, res, decodeURIComponent(parts[1]));
  return list(req, res, url);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AIworks console mock at http://127.0.0.1:${PORT}/console/api  (demo / consola-demo / 123456)`);
});
