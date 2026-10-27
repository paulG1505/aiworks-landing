import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappLink, whatsappTextLink } from './whatsapp.ts';

test('whatsappTextLink encodes a free text for the business number', () => {
  const text = 'Hola, quiero el asistente de WhatsApp para mi negocio.';
  const url = new URL(whatsappTextLink(text));
  assert.equal(url.origin + url.pathname, 'https://wa.me/593978923586');
  assert.equal(url.searchParams.get('text'), text);
});

test('whatsappLink keeps building the topic message', () => {
  const url = new URL(whatsappLink('es', 'facturas'));
  assert.match(url.searchParams.get('text') ?? '', /automatizar: facturas\.$/);
});
