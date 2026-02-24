import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function GradientText({
  children,
  className,
  direction = 'vertical'
}: GradientTextProps) {
  const gradientClass = direction === 'horizontal'
    ? 'bg-gradient-to-r from-[var(--primary-cyan)] to-[var(--primary-blue)]'
    : 'bg-gradient-to-b from-[var(--primary-cyan)] to-[var(--primary-blue)]';

  return (
    <span
      className={cn(
        gradientClass,
        'bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}
