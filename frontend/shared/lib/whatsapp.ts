import { CONTACT_INFO } from '@/shared/constants';
import type { Locale } from '@/shared/lib/i18n/translations';

/**
 * Constructor del enlace de WhatsApp. Existe porque el mensaje pre-cargado se
 * repetía en cinco archivos (hero, cabecera, pie, CTA final y el botón
 * flotante), y un número o un texto divergente entre ellos es justo el tipo de
 * error que nadie nota hasta que un prospecto recibe el mensaje equivocado.
 *
 * `proceso` permite que el mensaje llegue con contexto cuando se pulsa desde un
 * proceso concreto, para que la conversación no arranque en frío.
 */
const GENERICO: Record<Locale, string> = {
  es: 'Hola, vengo de la web de AIworks y me interesa automatizar un proceso en mi empresa.',
  en: "Hi, I'm coming from the AIworks website and I'm interested in automating a process in my company.",
};

const SOBRE_PROCESO: Record<Locale, (proceso: string) => string> = {
  es: (proceso) => `Hola, vengo de la web de AIworks y me interesa automatizar: ${proceso}.`,
  en: (proceso) => `Hi, I'm coming from the AIworks website and I'm interested in automating: ${proceso}.`,
};

const PESTANA_NUEVA: Record<Locale, string> = {
  es: '(se abre en una pestaña nueva)',
  en: '(opens in a new tab)',
};

export function enlaceWhatsApp(locale: Locale, proceso?: string): string {
  const mensaje = proceso ? SOBRE_PROCESO[locale](proceso) : GENERICO[locale];
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Sufijo de aria-label: quien usa lector de pantalla debe saber que abre otra pestaña. */
export function avisoPestanaNueva(locale: Locale): string {
  return PESTANA_NUEVA[locale];
}
