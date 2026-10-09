'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
}: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  const optionsRef = useRef({ threshold, root, rootMargin, freezeOnceVisible });

  useEffect(() => {
    optionsRef.current = { threshold, root, rootMargin, freezeOnceVisible };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const options = optionsRef.current;

    if (options.freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (options.freezeOnceVisible && isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold,
        root: options.root,
        rootMargin: options.rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return { ref: elementRef, isVisible };
}
