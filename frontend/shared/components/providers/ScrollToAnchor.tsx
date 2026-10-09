'use client';

import { useEffect } from 'react';

const MAX_WAIT_MS = 4000;

// Sections load through next/dynamic, so the browser's own anchor scroll fires before they exist.
export function ScrollToAnchor() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const start = performance.now();
    let frame = 0;
    const find = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
      if (performance.now() - start < MAX_WAIT_MS) frame = requestAnimationFrame(find);
    };
    frame = requestAnimationFrame(find);
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
