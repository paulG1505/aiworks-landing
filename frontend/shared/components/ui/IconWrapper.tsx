import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'gradient';
}

export function IconWrapper({
  icon: Icon,
  className,
  size = 'md',
  variant = 'default'
}: IconWrapperProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-12 h-12 p-2.5',
    lg: 'w-16 h-16 p-3.5',
    xl: 'w-20 h-20 p-4'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12'
  };

  const variantStyles = {
    default: 'bg-[var(--white-10)] text-white',
    primary: 'bg-[var(--primary-blue)]/20 text-[var(--primary-blue)]',
    gradient: 'bg-gradient-to-br from-[var(--primary-cyan)]/20 to-[var(--primary-blue)]/20 text-[var(--primary-cyan)]'
  };

  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}
