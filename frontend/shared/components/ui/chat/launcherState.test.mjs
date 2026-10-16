import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CLOUD_DISMISSED_KEY,
  getSessionStorage,
  isLauncherHidden,
  isLauncherRoute,
  planCloud,
  readCloudDismissed,
  writeCloudDismissed,
} from './launcherState.ts';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

const throwingStorage = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
};

test('desktop first visit schedules the cloud at 4s with no auto-hide', () => {
  assert.deepEqual(planCloud({ dismissed: false, isMobile: false }), {
    showAfterMs: 4000,
    autoHideAfterMs: null,
  });
});

test('mobile first visit schedules the cloud at 4s and hides it 6s later', () => {
  assert.deepEqual(planCloud({ dismissed: false, isMobile: true }), {
    showAfterMs: 4000,
    autoHideAfterMs: 6000,
  });
});

test('a dismissed cloud is never scheduled again', () => {
  assert.equal(planCloud({ dismissed: true, isMobile: false }), null);
  assert.equal(planCloud({ dismissed: true, isMobile: true }), null);
});

test('storage flag round-trips under the agreed key', () => {
  const storage = memoryStorage();
  assert.equal(readCloudDismissed(storage), false);
  writeCloudDismissed(storage);
  assert.equal(storage.getItem(CLOUD_DISMISSED_KEY), '1');
  assert.equal(CLOUD_DISMISSED_KEY, 'chat-cloud-dismissed');
  assert.equal(readCloudDismissed(storage), true);
});

test('failing or missing storage reads as not dismissed and never throws', () => {
  assert.equal(readCloudDismissed(null), false);
  assert.equal(readCloudDismissed(throwingStorage), false);
  assert.doesNotThrow(() => writeCloudDismissed(throwingStorage));
  assert.doesNotThrow(() => writeCloudDismissed(null));
});

test('getSessionStorage returns null when access throws', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get() {
      throw new Error('SecurityError');
    },
  });
  try {
    assert.equal(getSessionStorage(), null);
  } finally {
    if (original) Object.defineProperty(globalThis, 'sessionStorage', original);
    else delete globalThis.sessionStorage;
  }
});

test('the launcher is hidden on /demo routes only', () => {
  assert.equal(isLauncherRoute('/'), true);
  assert.equal(isLauncherRoute('/privacidad'), true);
  assert.equal(isLauncherRoute('/demo'), false);
  assert.equal(isLauncherRoute('/demo/'), false);
  assert.equal(isLauncherRoute('/demo/x'), false);
  assert.equal(isLauncherRoute('/demostraciones'), true);
  assert.equal(isLauncherRoute(null), true);
});

test('the launcher stays hidden until the CTA is confirmed off screen', () => {
  assert.equal(isLauncherHidden({ isOpen: false, ctaPosition: 'unknown' }), true);
  assert.equal(isLauncherHidden({ isOpen: false, ctaPosition: 'on-screen' }), true);
  assert.equal(isLauncherHidden({ isOpen: false, ctaPosition: 'off-screen' }), false);
  assert.equal(isLauncherHidden({ isOpen: true, ctaPosition: 'off-screen' }), true);
});
