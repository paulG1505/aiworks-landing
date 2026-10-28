import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WA_CHANNELS, channelLink, channelSlugs } from './waChannels.ts';

test('channelSlugs lists the generic route plus every channel', () => {
  assert.deepEqual(channelSlugs(), ['ig', 'fb', 'volante']);
});

test('channelLink opens the business number with the channel message', () => {
  for (const slug of channelSlugs()) {
    const url = new URL(channelLink(slug));
    assert.equal(url.origin + url.pathname, 'https://wa.me/593978923586');
    assert.equal(url.searchParams.get('text'), WA_CHANNELS[slug]);
  }
});

test('channelLink without a slug uses the generic message', () => {
  const url = new URL(channelLink());
  assert.match(url.searchParams.get('text') ?? '', /^Hola, vengo de la web de AIworks/);
});

test('channelLink returns null for an unknown channel', () => {
  assert.equal(channelLink('xyz'), null);
});

test('each channel message names where the lead comes from', () => {
  assert.match(WA_CHANNELS.ig, /Instagram/);
  assert.match(WA_CHANNELS.fb, /Facebook/);
  assert.match(WA_CHANNELS.volante, /volante/);
});
