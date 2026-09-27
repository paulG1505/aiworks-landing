'use client';

import { useId, useState } from 'react';

interface PreguntaProps {
  pregunta: string;
  respuesta: string;
  defaultOpen?: boolean;
}

/**
 * Item de acordeón sin caja: la única separación visual es el border-bottom
 * heredado del contenedor (ver Preguntas.tsx). El disparador es un <button>
 * real; el indicador +/− usa .tabular para no mover el layout al cambiar.
 *
 * Accesibilidad: cuando el panel está cerrado se saca del árbol con el
 * atributo `hidden` (no opacity/max-height), así no queda legible para un
 * lector de pantalla ni alcanzable con Tab. Por eso mismo no se anima la
 * apertura: animar algo que pasa por `display: none` obligaría a un truco
 * (max-height, clip) que reintroduce exactamente el problema de
 * accesibilidad que `hidden` resuelve. La spec permite prescindir del
 * efecto cuando complica el punto de accesibilidad.
 */
export function Pregunta({ pregunta, respuesta, defaultOpen = false }: PreguntaProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const buttonId = `preguntas-trigger-${reactId}`;
  const panelId = `preguntas-panel-${reactId}`;

  return (
    <div className="border-b border-regla">
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left text-[length:var(--paso-1)] font-medium text-tinta"
      >
        <span>{pregunta}</span>
        <span className="tabular shrink-0" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
      >
        <p className="medida pb-5 text-[length:var(--paso-0)] text-tinta-media">
          {respuesta}
        </p>
      </div>
    </div>
  );
}
