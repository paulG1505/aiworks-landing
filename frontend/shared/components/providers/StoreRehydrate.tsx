'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

export function StoreRehydrate() {
  const locale = useLanguageStore((state) => state.locale);

  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
