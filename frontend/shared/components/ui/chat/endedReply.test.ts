import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyEndedReply, shouldShowRemaining } from './endedReply.ts';

const base = { status: 200, hasWhatsappAction: true, hasCode: false };

test('a 429 ends the conversation as a limit', () => {
  assert.equal(classifyEndedReply({ reply: 'Ya probó bastante por hoy.', status: 429, hasWhatsappAction: true, hasCode: false }), 'limit');
});

test('a codeless WhatsApp action in a demo is the fixed limit text', () => {
  const reply = 'Esta es una demostración y ya usó sus mensajes. Para seguir, hablemos 15 minutos.';
  assert.equal(classifyEndedReply({ reply, ...base }), 'limit');
});

test('the resting text is recognised in both languages', () => {
  assert.equal(classifyEndedReply({ reply: 'Esta demo está descansando por hoy. Vuelva mañana.', ...base }), 'resting');
  assert.equal(classifyEndedReply({ reply: 'This demo is resting for today. Come back tomorrow.', ...base }), 'resting');
});

test('the expired text is recognised in both languages', () => {
  assert.equal(classifyEndedReply({ reply: 'Esta demo ya no está disponible.', ...base }), 'expired');
  assert.equal(classifyEndedReply({ reply: 'This demo is no longer available.', ...base }), 'expired');
});

test('a product that expired is not the expired demo text', () => {
  assert.equal(classifyEndedReply({ reply: 'El producto vencido se puede devolver.', status: 200, hasWhatsappAction: false, hasCode: false }), null);
  assert.equal(classifyEndedReply({ reply: 'El producto vencido se puede devolver.', ...base }), 'limit');
});

test('a normal answer does not end the conversation', () => {
  assert.equal(classifyEndedReply({ reply: 'Atendemos de lunes a sábado.', status: 200, hasWhatsappAction: false, hasCode: false }), null);
});

test('a WhatsApp action with a lead code is a normal answer', () => {
  assert.equal(classifyEndedReply({ reply: 'Perfecto, continúe por WhatsApp.', status: 200, hasWhatsappAction: true, hasCode: true }), null);
});

test('the remaining hint shows from 4 down to 1 only', () => {
  assert.equal(shouldShowRemaining(null), false);
  assert.equal(shouldShowRemaining(5), false);
  assert.equal(shouldShowRemaining(4), true);
  assert.equal(shouldShowRemaining(1), true);
  assert.equal(shouldShowRemaining(0), false);
});

test('an explicit state decides the kind regardless of the text', () => {
  const plain = { reply: 'Texto cualquiera del servidor.', status: 200, hasWhatsappAction: false, hasCode: false };
  assert.equal(classifyEndedReply({ ...plain, state: 'demo_limite_sesion' }), 'limit');
  assert.equal(classifyEndedReply({ ...plain, state: 'demo_limite_ip' }), 'limit');
  assert.equal(classifyEndedReply({ ...plain, state: 'demo_presupuesto' }), 'limit');
  assert.equal(classifyEndedReply({ ...plain, state: 'demo_descansando' }), 'resting');
  assert.equal(classifyEndedReply({ ...plain, state: 'demo_vencida' }), 'expired');
});

test('the state wins over a misleading text', () => {
  assert.equal(classifyEndedReply({ reply: 'Esta demo está descansando.', ...base, state: 'demo_vencida' }), 'expired');
});

test('an unknown or missing state falls back to the text heuristic', () => {
  assert.equal(classifyEndedReply({ reply: 'Esta demo está descansando por hoy.', ...base, state: 'otro' }), 'resting');
  assert.equal(classifyEndedReply({ reply: 'Esta demo ya no está disponible.', ...base, state: null }), 'expired');
  assert.equal(classifyEndedReply({ reply: 'Atendemos de lunes a sábado.', status: 200, hasWhatsappAction: false, hasCode: false, state: 'otro' }), null);
});
