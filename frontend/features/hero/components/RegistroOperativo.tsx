'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * El registro operativo: la demostración de "software con IA" en el primer vistazo. Es
 * un ejemplo y lo dice en su cabecera (rótulo punteado), no una demo que finge ser real.
 *
 * Escribe una línea cada 600ms, una sola vez y sin bucle. La animación es CSS pura
 * (`.registro-linea` en globals.css): el HTML exportado ya trae las cinco líneas, así que
 * sin JS o con prefers-reduced-motion el registro se ve completo y estático.
 */
const INTERVALO_MS = 600;

const COLOR_ETIQUETA = {
  entrada: 'text-tinta-media',
  ia: 'text-marca',
  sistema: 'text-tinta',
} as const;

interface RegistroOperativoProps {
  /** Retardo de la primera línea, para encadenar con la entrada del titular. */
  inicioMs?: number;
}

export function RegistroOperativo({ inicioMs = 0 }: RegistroOperativoProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="overflow-hidden rounded-[10px] border border-regla bg-arena">
        <div className="flex flex-col items-start gap-2 border-b border-regla px-3 py-2.5 font-mono text-[0.625rem] font-medium uppercase leading-tight tracking-[0.12em] text-tinta-media sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5 sm:text-[0.6875rem]">
          <span>{t.registro.titulo}</span>
          <span className="rotulo-ilustrativo">{t.registro.etiqueta}</span>
        </div>

        <ol className="flex flex-col gap-2.5 p-3 font-mono text-[0.71875rem] leading-[1.4] sm:px-5 sm:py-[18px] sm:text-[0.8125rem] sm:leading-[1.45]">
          {t.registro.lineas.map((linea, index) => (
            <li
              key={index}
              className="registro-linea flex flex-col gap-0.5 sm:grid sm:grid-cols-[48px_88px_minmax(0,1fr)] sm:gap-3"
              style={{ '--d': `${inicioMs + index * INTERVALO_MS}ms` } as React.CSSProperties}
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
      </div>

      <p className="medida mt-4 text-[0.9375rem] text-tinta-media">{t.registro.pie}</p>
    </div>
  );
}
