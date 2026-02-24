'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';
import { cn } from '@/shared/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';
  delay?: number;
}

// Hoist static objects outside component to avoid recreation (rendering-hoist-jsx)
const animations = {
  'fade-up': 'opacity-0 translate-y-10',
  'fade-in': 'opacity-0',
  'scale': 'opacity-0 scale-95',
  'slide-left': 'opacity-0 -translate-x-10',
  'slide-right': 'opacity-0 translate-x-10'
} as const;

const visibleState = {
  'fade-up': 'opacity-100 translate-y-0',
  'fade-in': 'opacity-100',
  'scale': 'opacity-100 scale-100',
  'slide-left': 'opacity-100 translate-x-0',
  'slide-right': 'opacity-100 translate-x-0'
} as const;

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  // Use optimized hook for prefers-reduced-motion (client-event-listeners)
  const prefersReducedMotion = usePrefersReducedMotion();

  // If user prefers reduced motion, skip animations
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        animations[animation],
        isVisible && visibleState[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
