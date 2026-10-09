'use client';

import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';

// The only scroll-linked animation on the site. Revealed phases stay revealed, while the
// line follows the scroll in both directions. Progress reaches CSS as the `--progreso`
// variable, so there is no re-render per frame.
export function usePhaseProgress(total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [reachedCount, setReachedCount] = useState(0);
  const reducedMotion = useReducedMotion();

  // 0 when the block's top edge crosses 75% of the screen; 1 when its bottom edge does.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.75'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value <= 0) return;
    const reached = Math.min(total, Math.floor(value * total + 1e-6) + 1);
    setReachedCount((previous) => Math.max(previous, reached));
  });

  return {
    ref,
    reachedCount: reducedMotion ? total : reachedCount,
    // Always the same MotionValue: Motion does not switch cleanly between a MotionValue and
    // a fixed number. With reduced motion, globals.css ignores the variable and fills the line.
    style: { '--progreso': progress } as unknown as React.CSSProperties,
  };
}
