'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

/**
 * Dos responsabilidades, ambas ligadas al idioma del store:
 *
 * 1. Dispara la rehidratación de Zustand tras el montaje en cliente.
 *    Necesario al usar skipHydration, para evitar un hydration mismatch de
 *    Next.js.
 * 2. Sincroniza `document.documentElement.lang` con el `locale` del store.
 *    `<html lang="es">` en app/layout.tsx es estático, pero el contenido
 *    cambia a inglés con el selector de idioma; sin este efecto un lector de
 *    pantalla sigue pronunciando el inglés con fonética española (falla WCAG
 *    3.1.1, nivel A).
 */
export function StoreRehydrate() {
  const locale = useLanguageStore((state) => state.locale);

  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
