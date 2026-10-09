'use client';

import { useSyncExternalStore } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { fijarTema, suscribirTema, temaActual, type Tema } from '@/shared/lib/tema';
import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * Botón sol / luna del header. Muestra el tema al que se va a pasar; al cambiar, el
 * ícono sale girando y entra el otro. En el servidor no se conoce el tema, así que el
 * primer render asume "claro" y React lo corrige al hidratar (useSyncExternalStore).
 */
export function SelectorTema() {
  const { locale } = useTranslation();
  const tema = useSyncExternalStore<Tema>(suscribirTema, temaActual, () => 'claro');
  const siguiente: Tema = tema === 'oscuro' ? 'claro' : 'oscuro';

  const etiqueta =
    locale === 'en'
      ? siguiente === 'oscuro' ? 'Switch to dark mode' : 'Switch to light mode'
      : siguiente === 'oscuro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';

  const Icono = tema === 'oscuro' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => fijarTema(siguiente)}
      aria-label={etiqueta}
      title={etiqueta}
      className="relative flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--c-regla)] text-[var(--c-texto)] transition-colors duration-150 hover:border-marca hover:text-marca"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={tema}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          <Icono className="size-4" aria-hidden="true" />
        </m.span>
      </AnimatePresence>
    </button>
  );
}
