import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingUrl, buildBookingMessage, formatExpiry, pickSuggestions, shouldShowBookingBar, formatConsulted, buildTakedownMessage, shouldShowDisclaimer } from './demoView.ts';

const FALLBACK = ['uno', 'dos', 'tres'] as const;

test('formats an ISO expiry as dd/mm', () => {
  assert.equal(formatExpiry('2026-11-11'), '11/11');
  assert.equal(formatExpiry('2026-03-05T10:00:00Z'), '05/03');
});

test('returns null for a missing or malformed expiry', () => {
  assert.equal(formatExpiry(null), null);
  assert.equal(formatExpiry(''), null);
  assert.equal(formatExpiry('mañana'), null);
});

test('uses the demo suggestions when the API sends them', () => {
  assert.deepEqual(pickSuggestions(['¿A?', '¿B?', '¿C?'], FALLBACK), ['¿A?', '¿B?', '¿C?']);
});

test('keeps at most three suggestions and drops blanks and non-strings', () => {
  assert.deepEqual(pickSuggestions(['¿A?', '  ', 7, '¿B?', '¿C?', '¿D?'], FALLBACK), ['¿A?', '¿B?', '¿C?']);
});

test('falls back to the generic suggestions when none are usable', () => {
  assert.deepEqual(pickSuggestions(undefined, FALLBACK), [...FALLBACK]);
  assert.deepEqual(pickSuggestions(null, FALLBACK), [...FALLBACK]);
  assert.deepEqual(pickSuggestions([], FALLBACK), [...FALLBACK]);
  assert.deepEqual(pickSuggestions(['', '   '], FALLBACK), [...FALLBACK]);
  assert.deepEqual(pickSuggestions('¿A?', FALLBACK), [...FALLBACK]);
});

test('booking message ends with the demo reference', () => {
  const es = buildBookingMessage('es', 'Tienda Ejemplo', 'tienda-ejemplo-k3m9x2');
  const en = buildBookingMessage('en', 'Tienda Ejemplo', 'tienda-ejemplo-k3m9x2');
  assert.ok(es.endsWith('[ref: tienda-ejemplo-k3m9x2]'));
  assert.ok(en.endsWith('[ref: tienda-ejemplo-k3m9x2]'));
  assert.ok(es.includes('Tienda Ejemplo'));
  assert.ok(es.includes('15 minutos'));
});

test('booking url encodes the message and keeps the reference intact', () => {
  const url = bookingUrl('593978923586', 'Hola [ref: sector-salud]');
  assert.equal(url, 'https://wa.me/593978923586?text=Hola%20%5Bref%3A%20sector-salud%5D');
  const text = new URL(url).searchParams.get('text');
  assert.equal(text, 'Hola [ref: sector-salud]');
});

test('the booking bar shows after 3 messages and never once the chat has ended', () => {
  assert.equal(shouldShowBookingBar(2, null), false);
  assert.equal(shouldShowBookingBar(3, null), true);
  assert.equal(shouldShowBookingBar(5, 'limit'), false);
  assert.equal(shouldShowBookingBar(5, 'resting'), false);
  assert.equal(shouldShowBookingBar(5, 'expired'), false);
});

test('formats the consulted date as dd/mm/yyyy', () => {
  assert.equal(formatConsulted('2026-10-15'), '15/10/2026');
  assert.equal(formatConsulted('2026-03-05T10:00:00Z'), '05/03/2026');
});

test('a missing or malformed consulted date is omitted', () => {
  assert.equal(formatConsulted(null), null);
  assert.equal(formatConsulted('ayer'), null);
});

test('the takedown message names the business and carries the ref', () => {
  assert.equal(
    buildTakedownMessage('es', 'Tienda Ejemplo', 'tienda-ejemplo-k3m9x2'),
    'Represento a Tienda Ejemplo y quiero que retiren su demostración [ref: tienda-ejemplo-k3m9x2]',
  );
  assert.equal(
    buildTakedownMessage('en', 'Tienda Ejemplo', 'tienda-ejemplo-k3m9x2'),
    'I represent Tienda Ejemplo and I want its demo taken down [ref: tienda-ejemplo-k3m9x2]',
  );
});

test('the disclaimer shows for prospect demos only', () => {
  assert.equal(shouldShowDisclaimer('demo'), true);
  assert.equal(shouldShowDisclaimer('demo_sector'), false);
  assert.equal(shouldShowDisclaimer('cliente'), false);
});
