import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor de 1200px con 64px de margen interior en escritorio (1072 útiles) y 20px
 * en móvil: a 320px quedan 280 útiles.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-16', className)}>
      {children}
    </div>
  );
}
