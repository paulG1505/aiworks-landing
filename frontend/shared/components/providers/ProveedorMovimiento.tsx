'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

/**
 * Configuración común de Motion para toda la página:
 * - LazyMotion + domAnimation: carga solo las animaciones de DOM (sin layout ni drag),
 *   y `strict` obliga a usar los componentes `m.*`, que no arrastran el bundle completo.
 * - reducedMotion="user": con prefers-reduced-motion, Motion salta directo al estado
 *   final en todas las animaciones de transform y deja solo cambios de opacidad.
 */
export function ProveedorMovimiento({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
