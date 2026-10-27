import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEM_VARIANTS, MENU_STATE, PANEL_VARIANTS } from './mobileMenuMotion.ts';

test('panel and items define every state the menu animates to', () => {
  for (const state of Object.values(MENU_STATE)) {
    assert.ok(state in PANEL_VARIANTS, `panel has no "${state}" variant`);
    assert.ok(state in ITEM_VARIANTS, `items have no "${state}" variant`);
  }
});

test('the open state is visible', () => {
  assert.equal(PANEL_VARIANTS[MENU_STATE.open].opacity, 1);
  assert.equal(ITEM_VARIANTS[MENU_STATE.open].opacity, 1);
});
