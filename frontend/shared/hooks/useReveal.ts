'use client';

import { useIntersectionObserver } from './useIntersectionObserver';

export function useReveal<T extends Element = HTMLDivElement>() {
  // rootMargin instead of threshold: a block taller than the screen never reaches a ratio.
  const { ref, isVisible } = useIntersectionObserver<T>({
    threshold: 0,
    rootMargin: '0px 0px -20% 0px',
  });

  return {
    ref,
    'data-reveal': '',
    'data-visible': isVisible ? '' : undefined,
  } as const;
}
