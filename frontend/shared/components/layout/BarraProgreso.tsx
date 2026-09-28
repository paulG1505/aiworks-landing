'use client';

import { m, useScroll, useSpring } from 'motion/react';

/**
 * Barra fina en petróleo al pie del header que indica cuánto de la página se ha leído.
 * Va ligada al scroll (no se mueve sola), así que no cuenta como movimiento autónomo; el
 * resorte solo suaviza los saltos de la rueda del mouse.
 */
export function BarraProgreso() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-marca"
    />
  );
}
