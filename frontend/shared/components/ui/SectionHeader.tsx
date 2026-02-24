import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { GradientText } from './GradientText';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  useGradient?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className,
  useGradient = false
}: SectionHeaderProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center'
  };

  return (
    <div className={cn('mb-12 lg:mb-16', alignStyles[align], className)}>
      {subtitle && (
        <p className="text-[var(--primary-cyan)] text-sm font-semibold uppercase tracking-wider mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {useGradient ? <GradientText>{title}</GradientText> : title}
      </h2>
      {description && (
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
