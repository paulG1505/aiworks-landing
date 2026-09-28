'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { fijarTema, suscribirTema, temaActual, type Tema } from '@/shared/lib/tema';
import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * Botón sol / luna del header. Muestra el tema al que se va a pasar. En el servidor no
 * se conoce el tema, así que el primer render asume "claro" y React lo corrige al
 * hidratar (useSyncExternalStore) sin desajuste.
 */
export function SelectorTema() {
  const { locale } = useTranslation();
  const tema = useSyncExternalStore<Tema>(suscribirTema, temaActual, () => 'claro');
  const siguiente: Tema = tema === 'oscuro' ? 'claro' : 'oscuro';

  const etiqueta =
    locale === 'en'
      ? siguiente === 'oscuro' ? 'Switch to dark mode' : 'Switch to light mode'
      : siguiente === 'oscuro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';

  return (
    <button
      type="button"
      onClick={() => fijarTema(siguiente)}
      aria-label={etiqueta}
      title={etiqueta}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--c-regla)] text-[var(--c-texto)] transition-colors duration-150 hover:bg-arena"
    >
      {tema === 'oscuro' ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
    </button>
  );
}
