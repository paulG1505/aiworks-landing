import { test } from 'node:test';
import assert from 'node:assert/strict';
import { es } from './es.ts';
import { en } from './en.ts';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]))
      : typeof value;

const publicPricingCopy = (t: typeof es | typeof en) =>
  JSON.stringify([t.pricing, t.faq.items.slice(0, 2), t.cta.description]);

test('pricing block has the same shape in both locales', () => {
  assert.deepEqual(shape(es.pricing), shape(en.pricing));
  assert.equal(es.pricing.items.length, 3);
});

test('pricing rows carry the founder and plan amounts', () => {
  assert.deepEqual(
    es.pricing.items.map((item) => item.amount),
    ['USD 169 + IVA', 'USD 49 + IVA al mes', 'USD 89 + IVA al mes'],
  );
  assert.deepEqual(
    en.pricing.items.map((item) => item.amount),
    ['USD 169 + VAT', 'USD 49 + VAT per month', 'USD 89 + VAT per month'],
  );
});

test('custom system row names no figure', () => {
  assert.equal(es.pricing.custom.amount, 'Se cotiza según su proceso');
  assert.doesNotMatch(JSON.stringify(es.pricing.custom), /\d{2,}\s*(USD|\$)|(USD|\$)\s*\d/);
  assert.doesNotMatch(JSON.stringify(en.pricing.custom), /(USD|\$)\s*\d/);
});

test('public copy speaks in conversations and hides the custom plan cap', () => {
  for (const t of [es, en]) {
    const copy = publicPricingCopy(t);
    assert.doesNotMatch(copy, /10[.,]?000|2[.,]?500|4[.,]?000|150-200/);
    assert.doesNotMatch(copy, /USD 149|USD 300|USD 45\b/);
    assert.doesNotMatch(copy, /rango concreto|una y dos semanas|concrete range/i);
  }
  assert.doesNotMatch(JSON.stringify(es.pricing), /respuestas/i);
});

test('first FAQ answer matches the pricing section', () => {
  for (const t of [es, en]) {
    const answer = t.faq.items[0].answer;
    assert.match(answer, /169/);
    assert.match(answer, /49/);
  }
});

test('whatsapp prefilled messages exist for both buttons', () => {
  for (const t of [es, en]) {
    assert.ok(t.pricing.ctaMessage.length > 10);
    assert.ok(t.pricing.custom.message.length > 10);
    assert.notEqual(t.pricing.ctaMessage, t.pricing.custom.message);
  }
});
