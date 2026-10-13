import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/shared/lib/i18n/translations';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'aiworks-language',
      skipHydration: true,
    }
  )
);
