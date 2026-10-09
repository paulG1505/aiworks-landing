'use client';

import { useIntersectionObserver } from './useIntersectionObserver';

// rootMargin instead of threshold: a block taller than the screen (a mobile list) never
// has 20% of its own height visible. The hidden states live in globals.css.
export function useReveal<T extends Element = HTMLDivElement>() {
  const { ref, isVisible } = useIntersectionObserver<T>({
    threshold: 0,
    rootMargin: '0px 0px -20% 0px',
  });

  return {
    ref,
    'data-revelar': '',
    'data-visible': isVisible ? '' : undefined,
  } as const;
}
