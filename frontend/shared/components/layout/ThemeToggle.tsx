'use client';

import { useSyncExternalStore } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, subscribeTheme, currentTheme, type Theme } from '@/shared/lib/theme';
import { useTranslation } from '@/shared/hooks/useTranslation';

// The server cannot know the theme: first render assumes light and hydration corrects it.
export function ThemeToggle() {
  const { locale } = useTranslation();
  const theme = useSyncExternalStore<Theme>(subscribeTheme, currentTheme, () => 'light');
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  const label =
    locale === 'en'
      ? next === 'dark' ? 'Switch to dark mode' : 'Switch to light mode'
      : next === 'dark' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';

  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="relative flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--c-regla)] text-[var(--c-texto)] transition-colors duration-150 hover:border-marca hover:text-marca"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          <Icon className="size-4" aria-hidden="true" />
        </m.span>
      </AnimatePresence>
    </button>
  );
}
