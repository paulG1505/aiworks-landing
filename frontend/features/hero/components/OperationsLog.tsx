'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

const INTERVAL_MS = 500;

const LABEL_COLOR = {
  input: 'text-[var(--term-entrada)]',
  ai: 'text-[var(--term-ia)]',
  decision: 'text-[var(--term-ok)]',
  review: 'text-[var(--term-revision)]',
  log: 'text-[var(--term-texto)]',
} as const;

type DelayStyle = React.CSSProperties & { '--d': string };
const delay = (ms: number): DelayStyle => ({ '--d': `${ms}ms` });

interface OperationsLogProps {
  startMs?: number;
}

export function OperationsLog({ startMs = 0 }: OperationsLogProps) {
  const { t } = useTranslation();
  const { lines, result } = t.log;

  const linesStart = startMs + 400;
  const resultStart = linesStart + lines.length * INTERVAL_MS + 150;

  return (
    <div>
      <figure
        aria-label={t.log.title}
        className="terminal overflow-hidden rounded-xl bg-[var(--term-fondo)] font-mono text-[var(--term-texto)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--term-regla)] bg-[var(--term-barra)] px-4 py-3">
          <span className="flex shrink-0 gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#FF5F57]" />
            <span className="size-3 rounded-full bg-[#FEBC2E]" />
            <span className="size-3 rounded-full bg-[#28C840]" />
          </span>
          <span className="hidden flex-1 truncate text-center text-xs text-[var(--term-media)] sm:block">
            {t.log.windowTitle}
          </span>
          <span className="ml-auto shrink-0 rounded border border-dashed border-[var(--term-media)] px-2 py-1 text-[0.6875rem] uppercase leading-none tracking-[0.12em] text-[var(--term-media)] sm:ml-0">
            {t.log.label}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-4 text-[0.8125rem] leading-[1.5] sm:px-5 sm:py-5 sm:text-[0.875rem]">
          <p className="log-line break-all" style={delay(startMs)}>
            <span className="text-[var(--term-media)]">$ </span>
            {t.log.command}
          </p>

          <ol className="flex flex-col gap-2.5">
            {lines.map((line, index) => (
              <li
                key={index}
                className="log-line flex flex-col gap-0.5 sm:grid sm:grid-cols-[48px_84px_minmax(0,1fr)] sm:gap-3"
                style={delay(linesStart + index * INTERVAL_MS)}
              >
                <span className="text-[var(--term-media)]">
                  <span className="tabular">{line.time}</span>
                  <span className="sm:hidden">
                    {'  '}
                    <span className={LABEL_COLOR[line.kind]}>{line.label}</span>
                  </span>
                </span>
                <span className={`hidden sm:inline ${LABEL_COLOR[line.kind]}`}>{line.label}</span>
                <span>{line.text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--term-regla)] pt-4">
            <span className="log-line mr-1 text-[var(--term-ok)]" style={delay(resultStart)}>
              ✓ {result.label}
            </span>
            {result.items.map((item, index) => (
              <span
                key={item}
                className="log-chip rounded-md border border-[var(--term-regla-fuerte)] px-2.5 py-1 text-[0.8125rem] leading-none"
                style={delay(resultStart + 120 + index * 140)}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </figure>

      <p className="measure mt-4 text-base text-tinta-media">{t.log.footnote}</p>
    </div>
  );
}
