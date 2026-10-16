import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveChatOutcome } from './chatOutcome.ts';

const ok = { ok: true as const, sessionId: null, reply: 'Atendemos de lunes a sábado.', action: null, remaining: null, state: null };

test('a 429 with a known state ends the demo', () => {
  const outcome = resolveChatOutcome({ ok: false, reason: 'limit', reply: 'Texto fijo.', state: 'demo_limite_ip' }, true);
  assert.deepEqual(outcome, { type: 'ended', kind: 'limit', text: 'Texto fijo.' });
});

test('a 429 without a known state is a retryable failure', () => {
  assert.deepEqual(resolveChatOutcome({ ok: false, reason: 'limit', reply: null, state: null }, true), { type: 'failure' });
  assert.deepEqual(resolveChatOutcome({ ok: false, reason: 'limit', reply: 'x', state: 'otro' }, true), { type: 'failure' });
});

test('remaining=0 delivers the reply and then ends the conversation', () => {
  const outcome = resolveChatOutcome({ ...ok, remaining: 0 }, true);
  assert.equal(outcome.type, 'reply');
  assert.equal(outcome.type === 'reply' && outcome.endsAfter, true);
  const open = resolveChatOutcome({ ...ok, remaining: 0 }, false);
  assert.equal(open.type === 'reply' && open.endsAfter, false);
});

test('a fixed state on a 200 reply ends the demo', () => {
  assert.deepEqual(resolveChatOutcome({ ...ok, reply: 'Descansa.', state: 'demo_descansando' }, true), {
    type: 'ended',
    kind: 'resting',
    text: 'Descansa.',
  });
});

test('404 and 500 are failures', () => {
  assert.deepEqual(resolveChatOutcome({ ok: false, reason: 'error' }, true), { type: 'failure' });
  assert.deepEqual(resolveChatOutcome({ ok: false, reason: 'timeout' }, false), { type: 'failure' });
  assert.deepEqual(resolveChatOutcome({ ok: false, reason: 'network' }, true), { type: 'failure' });
});
