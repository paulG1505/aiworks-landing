'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { Locale } from '@/shared/lib/i18n/translations';

export function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();

  const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          aria-pressed={locale === lang.code}
          className={
            locale === lang.code
              ? 'px-3 py-1 rounded-[4px] text-[length:var(--paso--1)] font-medium bg-[var(--tinta)] text-[var(--papel)]'
              : 'px-3 py-1 rounded-[4px] text-[length:var(--paso--1)] font-medium border border-[var(--regla)] text-[var(--tinta-media)] hover:border-[var(--tinta)] transition-colors duration-150'
          }
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
