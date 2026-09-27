'use client';

import { useId, useState } from 'react';

interface PreguntaProps {
  indice: number;
  pregunta: string;
  respuesta: string;
  defaultOpen?: boolean;
}

/**
 * Item de acordeón sin caja: la única separación es el filete inferior. El disparador
 * es un <button> real dentro de un <h3>, con aria-expanded y aria-controls, y el panel
 * es una región etiquetada por el botón.
 *
 * Apertura con altura (grid-template-rows 0fr → 1fr, 350ms; ver .respuesta en
 * globals.css). El panel cerrado lleva visibility: hidden, que —igual que `hidden`— lo
 * saca del árbol de accesibilidad y del orden de Tab, pero sí se puede animar. El "+"
 * rota a "–" y el texto de la respuesta baja con un fundido (fadeInDown de
 * animate.style) mientras el panel se abre. Con movimiento reducido no hay transición.
 */
export function Pregunta({ indice, pregunta, respuesta, defaultOpen = false }: PreguntaProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const buttonId = `preguntas-trigger-${reactId}`;
  const panelId = `preguntas-panel-${reactId}`;

  return (
    <div
      className="revelar border-b border-[var(--c-regla)]"
      style={{ '--d': `${indice * 90}ms` } as React.CSSProperties}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-serif text-[1.5rem] leading-[1.2] text-tinta sm:py-[26px] lg:text-[1.875rem]"
        >
          <span>{pregunta}</span>
          <span aria-hidden="true" className="relative size-4 shrink-0">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={`signo-barra absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current ${open ? '' : 'rotate-90'}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="respuesta"
        data-abierta={open ? '' : undefined}
      >
        <div>
          <p className="respuesta-texto medida pb-7 pr-0 leading-[1.6] text-tinta-media sm:pr-12">{respuesta}</p>
        </div>
      </div>
    </div>
  );
}
