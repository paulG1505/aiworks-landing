'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * El registro operativo, presentado como una ventana de terminal: la demostración de
 * "software con IA" en el primer vistazo. Es un ejemplo y lo dice en la barra de la
 * ventana (rótulo punteado), no una demo que finge ser real.
 *
 * Cuenta un caso que se entiende sin contexto técnico: un lead que escribe por WhatsApp
 * fuera de horario. Aparece el comando, luego el registro escribe una línea cada 500ms
 * y al final saltan las etiquetas del resultado. Todo una sola vez, sin bucle.
 *
 * La terminal es oscura en ambos temas: es un objeto, no una superficie de la página.
 * La animación es CSS pura (globals.css): el HTML exportado ya trae el contenido
 * completo, así que sin JS o con prefers-reduced-motion se ve entero y estático.
 */
const INTERVALO_MS = 500;

const COLOR_ETIQUETA = {
  entrada: 'text-[var(--term-entrada)]',
  ia: 'text-[var(--term-ia)]',
  decision: 'text-[var(--term-ok)]',
  revision: 'text-[var(--term-revision)]',
  registro: 'text-[var(--term-texto)]',
} as const;

type Retardo = React.CSSProperties & { '--d': string };
const retardo = (ms: number): Retardo => ({ '--d': `${ms}ms` });

interface RegistroOperativoProps {
  /** Retardo del comando, para encadenar con la entrada del titular. */
  inicioMs?: number;
}

export function RegistroOperativo({ inicioMs = 0 }: RegistroOperativoProps) {
  const { t } = useTranslation();
  const { lineas, resultado } = t.registro;

  const inicioLineas = inicioMs + 400;
  const inicioResultado = inicioLineas + lineas.length * INTERVALO_MS + 150;

  return (
    <div>
      <figure
        aria-label={t.registro.titulo}
        className="terminal overflow-hidden rounded-xl bg-[var(--term-fondo)] font-mono text-[var(--term-texto)]"
      >
        {/* Barra de la ventana: semáforo, título y rótulo de ejemplo. */}
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
          <p className="registro-linea break-all" style={retardo(inicioMs)}>
            <span className="text-[var(--term-media)]">$ </span>
            {t.registro.comando}
          </p>

          <ol className="flex flex-col gap-2.5">
            {lineas.map((linea, index) => (
              <li
                key={index}
                className="registro-linea flex flex-col gap-0.5 sm:grid sm:grid-cols-[48px_84px_minmax(0,1fr)] sm:gap-3"
                style={retardo(inicioLineas + index * INTERVALO_MS)}
              >
                {/* En móvil hora y etiqueta comparten línea y el texto baja; desde sm son tres columnas. */}
                <span className="text-[var(--term-media)]">
                  <span className="tabular">{linea.hora}</span>
                  <span className="sm:hidden">
                    {'  '}
                    <span className={COLOR_ETIQUETA[linea.tipo]}>{linea.etiqueta}</span>
                  </span>
                </span>
                <span className={`hidden sm:inline ${COLOR_ETIQUETA[linea.tipo]}`}>{linea.etiqueta}</span>
                <span>{linea.texto}</span>
              </li>
            ))}
          </ol>

          {/* Resultado: las etiquetas saltan al final, cuando el flujo ya terminó. */}
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--term-regla)] pt-4">
            <span className="registro-linea mr-1 text-[var(--term-ok)]" style={retardo(inicioResultado)}>
              ✓ {resultado.label}
            </span>
            {resultado.items.map((item, index) => (
              <span
                key={item}
                className="registro-chip rounded-md border border-[var(--term-regla-fuerte)] px-2.5 py-1 text-[0.8125rem] leading-none"
                style={retardo(inicioResultado + 120 + index * 140)}
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
