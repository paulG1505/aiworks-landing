'use client';

import { m, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
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
