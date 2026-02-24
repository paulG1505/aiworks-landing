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
          className={`
            px-3 py-1.5 rounded-md text-sm font-semibold transition-all
            ${
              locale === lang.code
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
