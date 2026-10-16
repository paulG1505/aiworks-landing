import { test } from 'node:test';
import assert from 'node:assert/strict';
import { displayHost, parsePublicUrl } from './publicUrl.ts';

test('accepts http and https urls', () => {
  assert.equal(parsePublicUrl('https://www.example.com'), 'https://www.example.com/');
  assert.equal(parsePublicUrl('http://example.com/a?b=1'), 'http://example.com/a?b=1');
});

test('rejects other protocols, relative values and non-strings', () => {
  assert.equal(parsePublicUrl('javascript:alert(1)'), null);
  assert.equal(parsePublicUrl('data:text/html,x'), null);
  assert.equal(parsePublicUrl('tienda.example.ec'), null);
  assert.equal(parsePublicUrl(''), null);
  assert.equal(parsePublicUrl(42), null);
  assert.equal(parsePublicUrl(null), null);
});

test('shows the host without www', () => {
  assert.equal(displayHost('https://www.example.com/tienda'), 'example.com');
  assert.equal(displayHost('https://cooperativa.example.ec'), 'cooperativa.example.ec');
});
