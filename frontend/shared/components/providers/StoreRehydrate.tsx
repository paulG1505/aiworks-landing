'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

export function StoreRehydrate() {
  const locale = useLanguageStore((state) => state.locale);

  // Required because the store uses skipHydration.
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  // <html lang> is static; without this a screen reader reads English with Spanish phonetics (WCAG 3.1.1).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
