'use client';

import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
