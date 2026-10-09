'use client';

import { useId, useState } from 'react';

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

// The closed panel uses visibility: hidden, which like `hidden` removes it from the
// accessibility tree and Tab order but, unlike `hidden`, can be animated (see .respuesta in globals.css).
export function FaqItem({ index, question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const buttonId = `preguntas-trigger-${reactId}`;
  const panelId = `preguntas-panel-${reactId}`;

  return (
    <div
      className="revelar border-b border-[var(--c-regla)]"
      style={{ '--d': `${index * 90}ms` } as React.CSSProperties}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-titular text-[1.25rem] font-medium leading-[1.25] tracking-[-0.015em] text-tinta sm:py-[26px] lg:text-[1.5rem]"
        >
          <span>{question}</span>
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
          <p className="respuesta-texto medida pb-7 pr-0 leading-[1.6] text-tinta-media sm:pr-12">{answer}</p>
        </div>
      </div>
    </div>
  );
}
