import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor de hasta 1440px. Margen interior de 20px en móvil (a 320px quedan 280
 * útiles), 32px en tablet y, en escritorio, entre 64 y 96px según el ancho de pantalla.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[clamp(4rem,6vw,6rem)]', className)}>
      {children}
    </div>
  );
}
