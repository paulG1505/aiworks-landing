import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glassmorphism' | 'gradient';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  variant = 'glassmorphism',
  padding = 'lg'
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variantStyles = {
    default: 'bg-[var(--white-8)] border border-[var(--white-15)]',
    glassmorphism: 'backdrop-blur-[10px] bg-[var(--white-8)] border border-[var(--white-15)]',
    gradient: 'bg-gradient-to-br from-[var(--white-8)] to-[var(--white-5)] border border-[var(--white-15)]'
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        'hover:border-[var(--white-20)] hover:shadow-lg hover:shadow-[var(--primary-blue)]/25',
        className
      )}
    >
      {children}
    </div>
  );
}
