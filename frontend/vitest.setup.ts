import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { matchesQuery, onViewportChange, resetViewport } from './vitest.viewport';

vi.mock('next/navigation', () => import('./vitest.navigation'));

beforeEach(() => {
  resetViewport();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      media: query,
      get matches() {
        return matchesQuery(query);
      },
      onchange: null,
      addEventListener: (_: string, callback: () => void) => onViewportChange(callback),
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  window.history.replaceState(null, '', '/consola');
});

afterEach(() => {
  cleanup();
});
