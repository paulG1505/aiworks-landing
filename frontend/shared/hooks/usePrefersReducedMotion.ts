'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect if user prefers reduced motion
 * Uses the existing optimized useMediaQuery hook (client-event-listeners)
 * @returns boolean indicating if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
