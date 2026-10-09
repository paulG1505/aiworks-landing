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
      // Avoids a hydration mismatch: the default state is used until the client rehydrates.
      skipHydration: true,
    }
  )
);
