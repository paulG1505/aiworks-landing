import { CONTACT_INFO } from '@/shared/constants';
import type { Locale } from '@/shared/lib/i18n/translations';

const GENERIC_MESSAGE: Record<Locale, string> = {
  es: 'Hola, vengo de la web de AIworks y me interesa automatizar un proceso en mi empresa.',
  en: "Hi, I'm coming from the AIworks website and I'm interested in automating a process in my company.",
};

const TOPIC_MESSAGE: Record<Locale, (topic: string) => string> = {
  es: (topic) => `Hola, vengo de la web de AIworks y me interesa automatizar: ${topic}.`,
  en: (topic) => `Hi, I'm coming from the AIworks website and I'm interested in automating: ${topic}.`,
};

const NEW_TAB_NOTICE: Record<Locale, string> = {
  es: '(se abre en una pestaña nueva)',
  en: '(opens in a new tab)',
};

export function whatsappLink(locale: Locale, topic?: string): string {
  const message = topic ? TOPIC_MESSAGE[locale](topic) : GENERIC_MESSAGE[locale];
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function newTabNotice(locale: Locale): string {
  return NEW_TAB_NOTICE[locale];
}
