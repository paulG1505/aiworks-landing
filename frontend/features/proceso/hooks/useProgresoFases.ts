'use client';

import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';

/**
 * La única animación del sitio ligada al scroll: la línea de "Cómo trabajamos" se llena
 * a medida que el bloque atraviesa la pantalla, y cada fase se revela cuando la línea la
 * alcanza (fase i en i/total). Las fases reveladas se quedan; la línea sí sigue al scroll
 * en ambos sentidos.
 *
 * Motion mide el scroll (useScroll) y lo suaviza con un resorte (useSpring), así la línea
 * no salta con cada golpe de rueda. El progreso llega al CSS como la variable --progreso
 * del contenedor, sin re-render por frame. Con movimiento reducido la línea queda llena
 * (regla en globals.css) y las fases visibles.
 */
export function useProgresoFases(total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [alcanzadas, setAlcanzadas] = useState(0);
  const reducido = useReducedMotion();

  // 0 cuando el borde superior del bloque cruza el 75% de la pantalla; 1 cuando lo cruza
  // el borde inferior.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.75'] });
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, 'change', (valor) => {
    if (valor <= 0) return;
    const n = Math.min(total, Math.floor(valor * total + 1e-6) + 1);
    setAlcanzadas((previas) => Math.max(previas, n));
  });

  return {
    ref,
    alcanzadas: reducido ? total : alcanzadas,
    // Siempre el mismo MotionValue: Motion no cambia bien de un MotionValue a un número
    // fijo. Con movimiento reducido, globals.css ignora la variable y deja la línea llena.
    estilo: { '--progreso': progreso } as unknown as React.CSSProperties,
  };
}
