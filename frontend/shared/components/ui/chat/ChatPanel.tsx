'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { Conversacion } from './Conversacion';
import { TEXTOS_CHAT } from './textos';

interface Props {
  abierto: boolean;
  alCerrar: () => void;
}

const FOCALIZABLES =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Panel flotante del chat de AIworks. Es un chunk aparte: ChatLauncher lo importa con
 * next/dynamic solo cuando alguien pulsa el botón.
 *
 * Móvil: ocupa la pantalla. Escritorio (lg): 400 px a la derecha, sobre el lanzador.
 * Accesibilidad: diálogo modal, foco atrapado, Esc cierra y el foco vuelve al lanzador
 * (eso último lo hace ChatLauncher, que sabe quién abrió).
 */
export default function PanelChat({ abierto, alCerrar }: Props) {
  const { locale } = useTranslation();
  const tx = TEXTOS_CHAT[locale];
  const idTitulo = useId();
  const raiz = useRef<HTMLDivElement>(null);

  // Mientras el panel está abierto, la página de atrás no se desplaza.
  useEffect(() => {
    if (!abierto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [abierto]);

  const alTeclear = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      alCerrar();
      return;
    }
    if (e.key !== 'Tab' || !raiz.current) return;
    const items = Array.from(raiz.current.querySelectorAll<HTMLElement>(FOCALIZABLES)).filter(
      (el) => el.offsetParent !== null,
    );
    if (items.length === 0) return;
    const primero = items[0];
    const ultimo = items[items.length - 1];
    const activo = document.activeElement;
    if (e.shiftKey && (activo === primero || !raiz.current.contains(activo))) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (activo === ultimo || !raiz.current.contains(activo))) {
      e.preventDefault();
      primero.focus();
    }
  };

  return (
    <div
      ref={raiz}
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
      hidden={!abierto}
      onKeyDown={alTeclear}
      className="chat-panel fixed inset-0 z-[70] flex h-dvh flex-col bg-papel text-tinta lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(41rem,calc(100dvh-3rem))] lg:w-[400px] lg:overflow-hidden lg:rounded-lg lg:border lg:border-[var(--regla-arena)]"
    >
      <header className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <h2 id={idTitulo} className="text-[1.5rem] leading-none">
            {tx.titulo}
          </h2>
          <p className="eyebrow eyebrow-marcador mt-2.5 !text-[0.6875rem]">{tx.etiqueta}</p>
        </div>
        <button
          type="button"
          onClick={alCerrar}
          aria-label={tx.cerrar}
          className="-mr-2 -mt-1 cursor-pointer rounded-full p-2 text-tinta-media transition-colors duration-150 hover:text-tinta"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>
      <div className="mx-5 border-t border-regla" />
      <Conversacion tenant="aiworks" enfocar={abierto} />
    </div>
  );
}
