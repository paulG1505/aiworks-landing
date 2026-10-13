'use client';

import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function usePhaseProgress(total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [reachedCount, setReachedCount] = useState(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.75'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value <= 0) return;
    const n = Math.min(total, Math.floor(value * total + 1e-6) + 1);
    setReachedCount((previous) => Math.max(previous, n));
  });

  return {
    ref,
    reachedCount: reduced ? total : reachedCount,
    style: { '--progress': progress } as unknown as React.CSSProperties,
  };
}
