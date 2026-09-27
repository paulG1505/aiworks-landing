'use client';

import { useIntersectionObserver } from './useIntersectionObserver';

/**
 * Disparador único de los revelados al hacer scroll: el bloque se revela una sola vez,
 * cuando su borde superior entra al 20% inferior del viewport. Se usa rootMargin y no
 * threshold porque un bloque más alto que la pantalla (una lista en móvil) nunca llega
 * a tener el 20% de su propia altura visible.
 *
 * Devuelve las props para el contenedor: `data-revelar` marca el grupo y `data-visible`
 * lo libera. Los estados ocultos viven en globals.css, bajo `html.js` y
 * `prefers-reduced-motion: no-preference`.
 */
export function useRevelado<T extends Element = HTMLDivElement>() {
  const { ref, isVisible } = useIntersectionObserver<T>({
    threshold: 0,
    rootMargin: '0px 0px -20% 0px',
  });

  return {
    ref,
    'data-revelar': '',
    'data-visible': isVisible ? '' : undefined,
  } as const;
}
