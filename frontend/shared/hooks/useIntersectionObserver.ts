'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
}: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Store options in ref to avoid recreating observer (rerender-dependencies)
  // This prevents unnecessary re-renders when options objects change
  const optionsRef = useRef({ threshold, root, rootMargin, freezeOnceVisible });

  // Update options ref when values change
  useEffect(() => {
    optionsRef.current = { threshold, root, rootMargin, freezeOnceVisible };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const options = optionsRef.current;

    // If already visible and freezeOnceVisible is true, don't observe
    if (options.freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // If freezeOnceVisible and now visible, disconnect observer
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
    // Only depend on isVisible to avoid recreating observer unnecessarily
  }, [isVisible]);

  return { ref: elementRef, isVisible };
}
