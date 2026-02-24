import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface BadgeProps {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'cyan' | 'gradient';
  className?: string;
}

export function Badge({
  children,
  icon: Icon,
  variant = 'default',
  className
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--white-10)] text-white border border-[var(--white-20)]',
    primary: 'bg-[var(--primary-blue)]/20 text-[var(--primary-blue)] border border-[var(--primary-blue)]/30',
    cyan: 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)] border border-[var(--primary-cyan)]/30',
    gradient: 'bg-gradient-to-r from-[var(--primary-cyan)]/30 to-[var(--primary-blue)]/30 text-white border border-white/40 backdrop-blur-sm shadow-lg'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-base font-medium',
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </div>
  );
}
