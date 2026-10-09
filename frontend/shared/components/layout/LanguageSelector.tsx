'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { Locale } from '@/shared/lib/i18n/translations';

const LANGUAGES: { code: Locale; label: string; name: string }[] = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <div
      role="group"
      aria-label={locale === 'en' ? 'Language' : 'Idioma'}
      className="flex w-fit rounded-full border border-[var(--c-regla)] font-mono text-[0.8125rem] font-medium"
    >
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            lang={lang.code}
            onClick={() => setLocale(lang.code)}
            aria-pressed={isActive}
            aria-label={lang.name}
            className={
              isActive
                ? 'cursor-pointer rounded-full bg-[var(--c-texto)] px-2.5 py-[7px] leading-none text-[var(--c-fondo)]'
                : 'cursor-pointer rounded-full px-2.5 py-[7px] leading-none text-[var(--c-media)] transition-colors duration-150 hover:text-[var(--c-texto)]'
            }
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
