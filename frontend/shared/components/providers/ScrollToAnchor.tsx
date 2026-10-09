'use client';

import { useEffect } from 'react';

/** Cuánto esperar a que aparezca la sección antes de rendirse. */
const ESPERA_MAXIMA_MS = 4000;

/**
 * Al entrar a la página con un ancla (p. ej. /#servicios desde /privacidad o desde un
 * enlace compartido), el navegador intenta desplazarse antes de que existan las
 * secciones, que se cargan con next/dynamic. Este componente espera a que el elemento
 * aparezca y entonces se desplaza hasta él, una sola vez.
 */
export function ScrollAlAncla() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const inicio = performance.now();
    let frame = 0;
    const buscar = () => {
      const destino = document.getElementById(id);
      if (destino) {
        destino.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
      if (performance.now() - inicio < ESPERA_MAXIMA_MS) frame = requestAnimationFrame(buscar);
    };
    frame = requestAnimationFrame(buscar);
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
