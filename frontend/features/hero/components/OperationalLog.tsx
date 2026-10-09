'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

// The animation is pure CSS (globals.css): the exported HTML already contains the full
// content, so without JS or with reduced motion it renders complete and static.
const LINE_INTERVAL_MS = 500;

const LABEL_COLOR = {
  entrada: 'text-[var(--term-entrada)]',
  ia: 'text-[var(--term-ia)]',
  decision: 'text-[var(--term-ok)]',
  revision: 'text-[var(--term-revision)]',
  registro: 'text-[var(--term-texto)]',
} as const;

type Delay = React.CSSProperties & { '--d': string };
const delay = (ms: number): Delay => ({ '--d': `${ms}ms` });

interface OperationalLogProps {
  /** Delay of the command, to chain with the headline entrance. */
  startMs?: number;
}

// Terminal-style window that is dark in both themes: it is an object, not a page surface.
export function OperationalLog({ startMs = 0 }: OperationalLogProps) {
  const { t } = useTranslation();
  const { lineas, resultado } = t.registro;

  const linesStartMs = startMs + 400;
  const resultStartMs = linesStartMs + lineas.length * LINE_INTERVAL_MS + 150;

  return (
    <div>
      <figure
        aria-label={t.registro.titulo}
        className="terminal overflow-hidden rounded-xl bg-[var(--term-fondo)] font-mono text-[var(--term-texto)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--term-regla)] bg-[var(--term-barra)] px-4 py-3">
          <span className="flex shrink-0 gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#FF5F57]" />
            <span className="size-3 rounded-full bg-[#FEBC2E]" />
            <span className="size-3 rounded-full bg-[#28C840]" />
          </span>
          <span className="hidden flex-1 truncate text-center text-xs text-[var(--term-media)] sm:block">
            {t.registro.ventana}
          </span>
          <span className="ml-auto shrink-0 rounded border border-dashed border-[var(--term-media)] px-2 py-1 text-[0.6875rem] uppercase leading-none tracking-[0.12em] text-[var(--term-media)] sm:ml-0">
            {t.registro.etiqueta}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-4 text-[0.8125rem] leading-[1.5] sm:px-5 sm:py-5 sm:text-[0.875rem]">
          <p className="registro-linea break-all" style={delay(startMs)}>
            <span className="text-[var(--term-media)]">$ </span>
            {t.registro.comando}
          </p>

          <ol className="flex flex-col gap-2.5">
            {lineas.map((linea, index) => (
              <li
                key={index}
                className="registro-linea flex flex-col gap-0.5 sm:grid sm:grid-cols-[48px_84px_minmax(0,1fr)] sm:gap-3"
                style={delay(linesStartMs + index * LINE_INTERVAL_MS)}
              >
                {/* On mobile, time and label share a line; from sm they are three columns. */}
                <span className="text-[var(--term-media)]">
                  <span className="tabular">{linea.hora}</span>
                  <span className="sm:hidden">
                    {'  '}
                    <span className={LABEL_COLOR[linea.tipo]}>{linea.etiqueta}</span>
                  </span>
                </span>
                <span className={`hidden sm:inline ${LABEL_COLOR[linea.tipo]}`}>{linea.etiqueta}</span>
                <span>{linea.texto}</span>
              </li>
            ))}
          </ol>

          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--term-regla)] pt-4">
            <span className="registro-linea mr-1 text-[var(--term-ok)]" style={delay(resultStartMs)}>
              ✓ {resultado.label}
            </span>
            {resultado.items.map((item, index) => (
              <span
                key={item}
                className="registro-chip rounded-md border border-[var(--term-regla-fuerte)] px-2.5 py-1 text-[0.8125rem] leading-none"
                style={delay(resultStartMs + 120 + index * 140)}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </figure>

      <p className="medida mt-4 text-base text-tinta-media">{t.registro.pie}</p>
    </div>
  );
}
