'use client';

import { useLanguageStore } from '@/shared/store/useLanguageStore';
import type { Locale } from '@/shared/lib/i18n/translations';

const LANGUAGES: { code: Locale; label: string; nombre: string }[] = [
  { code: 'es', label: 'ES', nombre: 'Español' },
  { code: 'en', label: 'EN', nombre: 'English' },
];

/** Control segmentado ES / EN. Toma los colores de contexto, así sirve en claro y oscuro. */
export function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <div
      role="group"
      aria-label={locale === 'en' ? 'Language' : 'Idioma'}
      className="flex w-fit rounded-full border border-[var(--c-regla)] font-mono text-xs font-medium"
    >
      {LANGUAGES.map((lang) => {
        const activo = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            lang={lang.code}
            onClick={() => setLocale(lang.code)}
            aria-pressed={activo}
            aria-label={lang.nombre}
            className={
              activo
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
