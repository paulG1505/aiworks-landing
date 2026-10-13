'use client';

import { createContext, useContext } from 'react';
import type { ConsoleApi } from './client';

export const ConsoleApiContext = createContext<ConsoleApi | null>(null);

export function useConsoleApi(): ConsoleApi {
  const api = useContext(ConsoleApiContext);
  if (!api) throw new Error('useConsoleApi must be used inside a ConsoleApiContext provider');
  return api;
}
