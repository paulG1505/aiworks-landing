'use client';

import { useId, useState } from 'react';

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FaqItem({ index, question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const buttonId = `faq-trigger-${reactId}`;
  const panelId = `faq-panel-${reactId}`;

  return (
    <div
      className="reveal border-b border-[var(--c-regla)]"
      style={{ '--d': `${index * 90}ms` } as React.CSSProperties}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-[1.25rem] font-medium leading-[1.25] tracking-[-0.015em] text-tinta sm:py-[26px] lg:text-[1.5rem]"
        >
          <span>{question}</span>
          <span aria-hidden="true" className="relative size-4 shrink-0">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={`plus-bar absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current ${open ? '' : 'rotate-90'}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="answer"
        data-open={open ? '' : undefined}
      >
        <div>
          <p className="answer-text measure pb-7 pr-0 leading-[1.6] text-tinta-media sm:pr-12">{answer}</p>
        </div>
      </div>
    </div>
  );
}
