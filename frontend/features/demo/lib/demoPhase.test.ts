import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phaseForHash, phaseFromInfo, phaseOnEnded, type DemoState } from './demoPhase.ts';

const info = { businessName: 'Tienda Ejemplo', type: 'demo', expires: null, suggestions: [], source: null, sector: null, consulted: null };
const ok: DemoState = { phase: 'ok', slug: 'tienda-ejemplo-k3m9x2', info };

test('the hash decides gallery, unavailable or a fetch', () => {
  assert.deepEqual(phaseForHash({ kind: 'none' }), { phase: 'gallery' });
  assert.deepEqual(phaseForHash({ kind: 'invalid' }), { phase: 'unavailable' });
  assert.equal(phaseForHash({ kind: 'slug', slug: 'abcdef' }), null);
});

test('the info result maps to a phase', () => {
  assert.deepEqual(phaseFromInfo('s', { status: 'ok', info }), { phase: 'ok', slug: 's', info });
  assert.deepEqual(phaseFromInfo('s', { status: 'unavailable' }), { phase: 'unavailable' });
  assert.deepEqual(phaseFromInfo('s', { status: 'error' }), { phase: 'error' });
});

test('resting keeps the conversation, expired makes the demo unavailable', () => {
  assert.equal(phaseOnEnded(ok, 'resting').phase, 'resting');
  assert.deepEqual(phaseOnEnded(ok, 'expired'), { phase: 'unavailable' });
  assert.equal(phaseOnEnded(ok, 'limit'), ok);
  assert.equal(phaseOnEnded(ok, null), ok);
});
