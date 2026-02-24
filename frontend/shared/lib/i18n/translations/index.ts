import { en } from './en';
import { es } from './es';

export const translations = {
  en,
  es,
} as const;

export type Locale = keyof typeof translations;
export type Translation = typeof en;
