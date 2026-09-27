'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * El registro operativo: la demostración de "software con IA" en el primer vistazo. Es
 * un ejemplo y lo dice en su cabecera (rótulo punteado), no una demo que finge ser real.
 *
 * Cuenta un caso que se entiende sin contexto técnico: un lead que escribe por WhatsApp
 * fuera de horario. Primero aparece el mensaje, luego el registro escribe una línea cada
 * 500ms y al final saltan las etiquetas del resultado. Todo una sola vez, sin bucle.
 *
 * La animación es CSS pura (globals.css): el HTML exportado ya trae el contenido
 * completo, así que sin JS o con prefers-reduced-motion el registro se ve entero y
 * estático.
 */
const INTERVALO_MS = 500;

const COLOR_ETIQUETA = {
  entrada: 'text-tinta-media',
  ia: 'text-marca',
  sistema: 'text-tinta',
} as const;

type Retardo = React.CSSProperties & { '--d': string };
const retardo = (ms: number): Retardo => ({ '--d': `${ms}ms` });

interface RegistroOperativoProps {
  /** Retardo del mensaje entrante, para encadenar con la entrada del titular. */
  inicioMs?: number;
}

export function RegistroOperativo({ inicioMs = 0 }: RegistroOperativoProps) {
  const { t } = useTranslation();
  const { mensaje, lineas, resultado } = t.registro;

  const inicioLineas = inicioMs + 450;
  const inicioResultado = inicioLineas + lineas.length * INTERVALO_MS + 150;

  return (
    <div>
      <div className="overflow-hidden rounded-[10px] border border-regla bg-arena">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-regla px-4 py-3 font-mono text-[0.6875rem] font-medium uppercase leading-tight tracking-[0.12em] text-tinta-media sm:px-5 sm:py-3.5 sm:text-xs">
          <span>{t.registro.titulo}</span>
          <span className="rotulo-ilustrativo">{t.registro.etiqueta}</span>
        </div>

        {/* Mensaje entrante: lo que dispara el flujo. */}
        <figure className="registro-mensaje border-b border-regla px-4 py-4 sm:px-5" style={retardo(inicioMs)}>
          <figcaption className="font-mono text-[0.75rem] text-tinta-media">{mensaje.canal}</figcaption>
          <blockquote className="mt-2 w-fit max-w-[34ch] rounded-2xl rounded-tl-sm bg-papel px-4 py-3 text-[1rem] leading-snug text-tinta sm:text-[1.0625rem]">
            “{mensaje.texto}”
          </blockquote>
        </figure>

        <ol className="flex flex-col gap-2.5 px-4 py-4 font-mono text-[0.8125rem] leading-[1.45] sm:px-5 sm:py-[18px] sm:text-[0.875rem]">
          {lineas.map((linea, index) => (
            <li
              key={index}
              className="registro-linea flex flex-col gap-0.5 sm:grid sm:grid-cols-[52px_96px_minmax(0,1fr)] sm:gap-3"
              style={retardo(inicioLineas + index * INTERVALO_MS)}
            >
              {/* En móvil hora y etiqueta comparten línea y el mensaje baja; desde sm son tres columnas. */}
              <span className="text-tinta-media">
                <span className="tabular">{linea.hora}</span>
                <span className="sm:hidden">
                  {' · '}
                  <span className={COLOR_ETIQUETA[linea.tipo]}>{linea.etiqueta}</span>
                </span>
              </span>
              <span className={`hidden sm:inline ${COLOR_ETIQUETA[linea.tipo]}`}>{linea.etiqueta}</span>
              <span className="text-tinta">{linea.texto}</span>
            </li>
          ))}
        </ol>

        {/* Resultado: las etiquetas saltan al final, cuando el flujo ya terminó. */}
        <div className="flex flex-wrap items-center gap-2 border-t border-regla px-4 py-3.5 sm:px-5">
          <span className="registro-linea mr-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-tinta-media sm:text-xs" style={retardo(inicioResultado)}>
            {resultado.label}
          </span>
          {resultado.items.map((item, index) => (
            <span
              key={item}
              className="registro-chip rounded-full bg-tinta px-3 py-1.5 text-[0.8125rem] font-medium leading-none text-papel sm:text-sm"
              style={retardo(inicioResultado + 120 + index * 140)}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className="medida mt-4 text-base text-tinta-media">{t.registro.pie}</p>
    </div>
  );
}
