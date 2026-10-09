import { CONTACT_INFO } from '@/shared/constants';
import type { Locale } from '@/shared/lib/i18n/translations';

// Single source for the prefilled WhatsApp message: a diverging number or text between
// call sites goes unnoticed until a prospect receives the wrong message.
const GENERIC_MESSAGE: Record<Locale, string> = {
  es: 'Hola, vengo de la web de AIworks y me interesa automatizar un proceso en mi empresa.',
  en: "Hi, I'm coming from the AIworks website and I'm interested in automating a process in my company.",
};

const PROCESS_MESSAGE: Record<Locale, (process: string) => string> = {
  es: (process) => `Hola, vengo de la web de AIworks y me interesa automatizar: ${process}.`,
  en: (process) => `Hi, I'm coming from the AIworks website and I'm interested in automating: ${process}.`,
};

const NEW_TAB_NOTICE: Record<Locale, string> = {
  es: '(se abre en una pestaña nueva)',
  en: '(opens in a new tab)',
};

export function whatsappLink(locale: Locale, process?: string): string {
  const message = process ? PROCESS_MESSAGE[locale](process) : GENERIC_MESSAGE[locale];
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}

// aria-label suffix: screen reader users need to know the link opens another tab.
export function newTabNotice(locale: Locale): string {
  return NEW_TAB_NOTICE[locale];
}
