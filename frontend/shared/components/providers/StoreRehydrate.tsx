'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

/**
 * Triggers Zustand persist rehydration after client mount.
 * Required when using skipHydration to avoid Next.js hydration mismatch.
 */
export function StoreRehydrate() {
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  return null;
}
