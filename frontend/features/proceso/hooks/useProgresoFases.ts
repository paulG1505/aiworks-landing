'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

/**
 * La única animación del sitio ligada al scroll: la línea de "Cómo trabajamos" se llena
 * a medida que el bloque atraviesa la pantalla, y cada fase se revela cuando la línea la
 * alcanza (fase i en i/total). Las fases reveladas se quedan; la línea sí sigue al scroll
 * en ambos sentidos.
 *
 * El progreso se escribe como variable CSS directamente en el nodo (sin re-render por
 * frame); solo el número de fases alcanzadas pasa por el estado de React. Con
 * movimiento reducido no hay listener: la línea queda llena y las fases visibles (CSS).
 */
export function useProgresoFases(total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [alcanzadas, setAlcanzadas] = useState(0);
  const reducido = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducido) return;

    let frame = 0;
    const medir = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza cuando el borde superior cruza el 75% del viewport y termina tras
      // recorrer la altura del bloque (o 40% de pantalla si el bloque es más bajo).
      const bruto = (vh * 0.75 - rect.top) / Math.max(rect.height, vh * 0.4);
      const progreso = Math.min(1, Math.max(0, bruto));
      el.style.setProperty('--progreso', progreso.toFixed(4));
      if (progreso > 0) {
        const n = Math.min(total, Math.floor(progreso * total + 1e-6) + 1);
        setAlcanzadas((previas) => Math.max(previas, n));
      }
    };
    const alScroll = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll);
    return () => {
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.removeProperty('--progreso');
    };
  }, [reducido, total]);

  return { ref, alcanzadas: reducido ? total : alcanzadas };
}
