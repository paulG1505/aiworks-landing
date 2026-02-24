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
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'aiworks-language',
      // Prevents hydration mismatch: store uses default state until client rehydrates
      skipHydration: true,
    }
  )
);
