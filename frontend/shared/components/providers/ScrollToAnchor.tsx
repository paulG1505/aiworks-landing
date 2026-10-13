'use client';

import { useEffect } from 'react';

const MAX_WAIT_MS = 4000;

export function ScrollToAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const startedAt = performance.now();
    let frame = 0;
    const seek = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
      if (performance.now() - startedAt < MAX_WAIT_MS) frame = requestAnimationFrame(seek);
    };
    frame = requestAnimationFrame(seek);
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
