'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

// `strict` forces `m.*` components so the full Motion bundle is never pulled in.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
