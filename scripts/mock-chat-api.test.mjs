import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const PORT = 18_700 + Math.floor(Math.random() * 200);
const BASE = `http://127.0.0.1:${PORT}`;
let server;

before(async () => {
  server = spawn(process.execPath, [new URL('./mock-chat-api.mjs', import.meta.url).pathname, String(PORT)], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  await once(server.stdout, 'data');
});

after(() => server.kill());

const info = (tenant) => fetch(`${BASE}/chat/${tenant}/info`);
const chat = (tenant, body) =>
  fetch(`${BASE}/chat/${tenant}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('a client demo returns the optional fields', async () => {
  const body = await (await info('demo-tienda-ejemplo-k3m9x2')).json();
  assert.equal(body.nombre_negocio, 'Tienda Ejemplo');
  assert.equal(body.tipo, 'demo');
  assert.equal(body.sugerencias.length, 3);
  assert.match(body.fuente, /^https:\/\//);
  assert.match(body.vence, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(body.consultado, '2026-10-12');
});

test('a prospect demo can come without the consulted date', async () => {
  const body = await (await info('demo-sinconsultado-k3m9x2')).json();
  assert.equal('consultado' in body, false);
  assert.equal(body.tipo, 'demo');
});

test('sector demos carry no consulted date', async () => {
  assert.equal('consultado' in (await (await info('demo-sector-salud')).json()), false);
});

test('a sector demo has a sector and no expiry', async () => {
  const body = await (await info('demo-sector-salud')).json();
  assert.equal(body.tipo, 'demo_sector');
  assert.equal(body.sector, 'salud');
  assert.equal(body.vence, null);
});

test('sector demos use the official business names', async () => {
  const expected = {
    comercio: 'Mercadito Quillay',
    salud: 'Clínica Santa Aurelia',
    finanzas: 'Cooperativa de Ahorro y Crédito Alto Yacu',
    logistica: 'Envíos Ruta Cóndor',
  };
  for (const [sector, name] of Object.entries(expected)) {
    assert.equal((await (await info(`demo-sector-${sector}`)).json()).nombre_negocio, name);
  }
});

test('a legacy demo has none of the optional fields', async () => {
  const body = await (await info('demo-clasica-a1b2c3')).json();
  assert.equal('sugerencias' in body, false);
  assert.equal('fuente' in body, false);
});

test('an unknown demo answers 404', async () => {
  assert.equal((await info('demo-nohay-k3m9x2')).status, 404);
});

test('message 8 reports 4 left and message 13 gets the fixed limit text', async () => {
  let sessionId;
  for (let n = 1; n <= 12; n++) {
    const body = await (await chat('demo-tienda-ejemplo-k3m9x2', { sesion_id: sessionId, mensaje: `pregunta ${n}`, idioma: 'es' })).json();
    sessionId = body.sesion_id;
    if (n < 8) assert.equal('restantes' in body, false, `message ${n}`);
    if (n === 8) assert.equal(body.restantes, 4);
    if (n === 12) assert.equal(body.restantes, 0);
    assert.equal(body.accion, null);
  }
  const last = await (await chat('demo-tienda-ejemplo-k3m9x2', { sesion_id: sessionId, mensaje: 'otra', idioma: 'es' })).json();
  assert.match(last.respuesta, /^Esta es una demostración/);
  assert.equal(last.accion.tipo, 'whatsapp');
  assert.equal(last.accion.codigo, null);
});

test('limit, resting and expired demos answer their fixed texts', async () => {
  const cases = [
    ['demo-limite-k3m9x2', /^Esta es una demostración/],
    ['demo-descanso-k3m9x2', /descansando por hoy/],
    ['demo-vencida-k3m9x2', /ya no está disponible/],
  ];
  for (const [tenant, pattern] of cases) {
    const body = await (await chat(tenant, { mensaje: 'hola', idioma: 'es' })).json();
    assert.match(body.respuesta, pattern, tenant);
    assert.equal(body.accion.tipo, 'whatsapp');
  }
});

test('fixed-text replies carry their explicit state', async () => {
  const cases = [
    ['demo-limite-k3m9x2', 'demo_limite_sesion'],
    ['demo-descanso-k3m9x2', 'demo_descansando'],
    ['demo-vencida-k3m9x2', 'demo_vencida'],
  ];
  for (const [tenant, state] of cases) {
    const body = await (await chat(tenant, { mensaje: 'hola', idioma: 'es' })).json();
    assert.equal(body.estado, state, tenant);
  }
  const ip = await chat('demo-tienda-ejemplo-k3m9x2', { mensaje: 'limite', idioma: 'es' });
  assert.equal(ip.status, 429);
  assert.equal((await ip.json()).estado, 'demo_limite_ip');
});

test('sinestado tenants and normal replies omit the state', async () => {
  for (const tenant of ['demo-limite-sinestado-k3m9x2', 'demo-descanso-sinestado-k3m9x2', 'demo-vencida-sinestado-k3m9x2']) {
    const body = await (await chat(tenant, { mensaje: 'hola', idioma: 'es' })).json();
    assert.equal('estado' in body, false, tenant);
    assert.equal(body.accion.tipo, 'whatsapp');
  }
  const normal = await (await chat('demo-tienda-ejemplo-k3m9x2', { mensaje: 'hola', idioma: 'es' })).json();
  assert.equal('estado' in normal, false);
  const ipLegacy = await chat('demo-sinestado-k3m9x2', { mensaje: 'limite', idioma: 'es' });
  assert.equal(ipLegacy.status, 429);
  assert.equal('estado' in (await ipLegacy.json()), false);
});

test('the english fixed text follows the request language', async () => {
  const body = await (await chat('demo-descanso-k3m9x2', { mensaje: 'hi', idioma: 'en' })).json();
  assert.match(body.respuesta, /resting for today/);
});

test('the aiworks tenant is unchanged', async () => {
  const body = await (await chat('aiworks', { mensaje: 'cuánto cuesta', idioma: 'es' })).json();
  assert.equal('restantes' in body, false);
  assert.equal((await chat('aiworks', { mensaje: 'limite', idioma: 'es' })).status, 429);
});
