'use client';

import { useTranslation } from '@/shared/hooks/useTranslation';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

/**
 * El registro operativo es el único elemento animado de toda la página (ver
 * changes/rediseno-landing-octubre/sistema-visual.md). La primera línea está
 * desde el primer frame; las otras cuatro encadenan a 180ms al entrar en
 * viewport, una sola vez y sin bucle. Con prefers-reduced-motion las cinco se
 * muestran completas y estáticas.
 */
// Revisión de diseño (2026-09-25): el encadenado iba a 400ms y se repetía en bucle.
// Dos problemas reales, vistos en captura: (a) el visitante miraba ~1,6s una caja negra
// prácticamente vacía, y el registro es el elemento memorable de la página; (b) un bucle
// permanente contradice el principio del sistema visual —un solo momento orquestado—
// y es movimiento no solicitado en el punto de mayor atención.
// Ahora: la primera línea está desde el inicio, el resto encadena a 180ms (total ~720ms)
// y no se repite.
const RETARDO_ENTRE_LINEAS_MS = 180;

export function RegistroOperativo() {
  const { t } = useTranslation();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const lineas = t.registro.lineas;

  // Con movimiento reducido, o antes de entrar en viewport la primera vez, las
  // líneas no llevan la clase animada: se muestran estáticas (reduced motion) o
  // invisibles a la espera del primer disparo (animación normal).
  const animar = !prefersReducedMotion && isVisible;

  return (
    <div>
      <div
        ref={ref}
        className="rounded-[6px] border px-6 py-6 sm:px-8 sm:py-7 bg-[var(--registro-fondo)] text-[var(--registro-texto)] border-[var(--registro-regla)]"
      >
        <p
          className="tracking-normal normal-case"
          style={{ fontSize: 'var(--paso--1)', color: 'var(--registro-media)' }}
        >
          {t.registro.etiqueta}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {lineas.map((linea, index) => (
            <li
              key={index}
              // La primera línea nunca se anima: el bloque tiene que decir algo desde
              // el primer instante, no ser un rectángulo negro vacío mientras carga.
              className={`flex gap-4 ${animar && index > 0 ? 'registro-linea' : ''}`}
              style={
                index === 0 || prefersReducedMotion
                  ? undefined
                  : animar
                    ? { animationDelay: `${(index - 1) * RETARDO_ENTRE_LINEAS_MS}ms` }
                    : { opacity: 0 }
              }
            >
              <span className="tabular text-[var(--registro-media)]">{linea.hora}</span>
              <span>{linea.texto}</span>
            </li>
          ))}
        </ul>
      </div>

      <p
        className="medida mt-4"
        style={{ color: 'var(--tinta-media)', fontSize: 'var(--paso-0)' }}
      >
        {t.registro.pie}
      </p>
    </div>
  );
}
