import type { EndedKind } from '@/shared/components/ui/chat/endedReply';
import type { Locale } from '@/shared/lib/i18n/translations';

const MAX_SUGGESTIONS = 3;

export function formatExpiry(iso: string | null): string | null {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}` : null;
}

export function pickSuggestions(value: unknown, fallback: readonly string[]): string[] {
  const usable = Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, MAX_SUGGESTIONS)
    : [];
  return usable.length > 0 ? usable : [...fallback];
}

const BOOKING_MESSAGE: Record<Locale, (subject: string, slug: string) => string> = {
  es: (subject, slug) =>
    `Hola, vi la demo del asistente de ${subject} y quiero agendar un diagnóstico de 15 minutos. [ref: ${slug}]`,
  en: (subject, slug) =>
    `Hi, I saw the ${subject} assistant demo and I'd like to book a 15-minute assessment. [ref: ${slug}]`,
};

export function buildBookingMessage(locale: Locale, subject: string, slug: string): string {
  return BOOKING_MESSAGE[locale](subject, slug);
}

export function bookingUrl(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const BOOKING_BAR_AFTER_MESSAGES = 3;

export function shouldShowBookingBar(userMessages: number, ended: EndedKind | null): boolean {
  return userMessages >= BOOKING_BAR_AFTER_MESSAGES && ended === null;
}

export function formatConsulted(iso: string | null): string | null {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : null;
}

const TAKEDOWN_MESSAGE: Record<Locale, (name: string, slug: string) => string> = {
  es: (name, slug) => `Represento a ${name} y quiero que retiren su demostración [ref: ${slug}]`,
  en: (name, slug) => `I represent ${name} and I want its demo taken down [ref: ${slug}]`,
};

export function buildTakedownMessage(locale: Locale, name: string, slug: string): string {
  return TAKEDOWN_MESSAGE[locale](name, slug);
}

export function shouldShowDisclaimer(type: string): boolean {
  return type === 'demo';
}
