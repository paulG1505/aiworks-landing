import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_SLUG_EXAMPLES, demoTenantId, isValidDemoSlug, parseDemoHash } from './demoSlug.ts';

test('accepts every shared valid example', () => {
  for (const slug of DEMO_SLUG_EXAMPLES.valid) assert.equal(isValidDemoSlug(slug), true, slug);
});

test('rejects every shared invalid example', () => {
  for (const slug of DEMO_SLUG_EXAMPLES.invalid) assert.equal(isValidDemoSlug(slug), false, slug);
});

test('enforces the 6 to 48 character range', () => {
  assert.equal(isValidDemoSlug('a'.repeat(5)), false);
  assert.equal(isValidDemoSlug('a'.repeat(6)), true);
  assert.equal(isValidDemoSlug('a'.repeat(48)), true);
  assert.equal(isValidDemoSlug('a'.repeat(49)), false);
});

test('rejects hyphen edges, doubled hyphens, uppercase and symbols', () => {
  for (const slug of ['-abcdef', 'abcdef-', 'abc--def', 'ABCDEF', 'abc_def', 'abc def', 'abcdéf']) {
    assert.equal(isValidDemoSlug(slug), false, slug);
  }
});

test('reads the slug from a location hash', () => {
  assert.deepEqual(parseDemoHash('#tienda-ejemplo-k3m9x2'), { kind: 'slug', slug: 'tienda-ejemplo-k3m9x2' });
  assert.deepEqual(parseDemoHash('  #tienda-ejemplo-k3m9x2 '), { kind: 'slug', slug: 'tienda-ejemplo-k3m9x2' });
});

test('treats an empty hash as none and a malformed one as invalid', () => {
  assert.deepEqual(parseDemoHash(''), { kind: 'none' });
  assert.deepEqual(parseDemoHash('#'), { kind: 'none' });
  assert.deepEqual(parseDemoHash('#abc'), { kind: 'invalid' });
  assert.deepEqual(parseDemoHash('#abcdef04hvice/../x'), { kind: 'invalid' });
  assert.deepEqual(parseDemoHash('#Tienda-Ejemplo-K3M9X2'), { kind: 'invalid' });
});

test('builds the tenant id', () => {
  assert.equal(demoTenantId('tienda-ejemplo-k3m9x2'), 'demo-tienda-ejemplo-k3m9x2');
});
