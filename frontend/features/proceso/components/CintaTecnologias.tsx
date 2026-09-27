'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';
import { TECNOLOGIAS } from '../data/tecnologias';

interface CintaTecnologiasProps {
  label: string;
  pausar: string;
  reanudar: string;
}

/** Segundos que tarda la cinta en recorrer una vuelta completa. */
const VUELTA_S = 28;

/** Los logos se desvanecen en los bordes en lugar de cortarse en seco. */
const MASCARA = 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)';

/**
 * Cinta de logos en movimiento horizontal continuo. La pista lleva la lista dos veces y
 * se desplaza -50%, así el bucle no tiene salto.
 *
 * El movimiento usa la Web Animations API y no una animación de globals.css: vive y se
 * controla desde el propio componente, sin depender del orden de la hoja de estilos ni
 * de que el navegador tenga la versión actual en caché.
 *
 * Se detiene al pasar el mouse, al enfocar un elemento dentro o con el botón (WCAG
 * 2.2.2: todo movimiento de más de 5s debe poder pausarse). Con prefers-reduced-motion
 * no se crea la animación: los logos se reparten en filas y no se duplican. La copia es
 * aria-hidden; el nombre de cada tecnología está en el <title> del SVG.
 */
export function CintaTecnologias({ label, pausar, reanudar }: CintaTecnologiasProps) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const animacionRef = useRef<Animation | null>(null);
  const [pausadaPorBoton, setPausadaPorBoton] = useState(false);
  const [encima, setEncima] = useState(false);
  const reducido = usePrefersReducedMotion();

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista || reducido || typeof pista.animate !== 'function') return;
    const animacion = pista.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: VUELTA_S * 1000, iterations: Infinity, easing: 'linear' },
    );
    animacionRef.current = animacion;
    return () => {
      animacion.cancel();
      animacionRef.current = null;
    };
  }, [reducido]);

  useEffect(() => {
    const animacion = animacionRef.current;
    if (!animacion) return;
    if (pausadaPorBoton || encima) animacion.pause();
    else animacion.play();
  }, [pausadaPorBoton, encima, reducido]);

  const lista = (copia: boolean) => (
    <ul
      className={`flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 ${reducido ? 'flex-wrap gap-y-6' : ''}`}
      aria-hidden={copia || undefined}
      aria-label={copia ? undefined : label}
    >
      {TECNOLOGIAS.map((tec) => (
        <li key={tec.nombre} className="shrink-0">
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="size-8 fill-current text-hueso opacity-90 transition-opacity duration-150 hover:opacity-100 sm:size-9"
          >
            <title>{tec.nombre}</title>
            {tec.trazados.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{label}</p>
        {!reducido && (
          <button
            type="button"
            onClick={() => setPausadaPorBoton((p) => !p)}
            aria-pressed={pausadaPorBoton}
            className="cursor-pointer rounded-full border border-[var(--regla-noche)] px-3 py-1.5 font-mono text-xs text-hueso-medio transition-colors duration-150 hover:border-hueso-medio hover:text-hueso"
          >
            {pausadaPorBoton ? reanudar : pausar}
          </button>
        )}
      </div>

      <div
        data-cinta=""
        className="overflow-hidden"
        style={reducido ? undefined : { WebkitMaskImage: MASCARA, maskImage: MASCARA }}
        onMouseEnter={() => setEncima(true)}
        onMouseLeave={() => setEncima(false)}
        onFocus={() => setEncima(true)}
        onBlur={() => setEncima(false)}
      >
        <div ref={pistaRef} className={`flex ${reducido ? '' : 'w-max'}`}>
          {lista(false)}
          {!reducido && lista(true)}
        </div>
      </div>
    </div>
  );
}
