import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[clamp(4rem,6vw,6rem)]', className)}>
      {children}
    </div>
  );
}
