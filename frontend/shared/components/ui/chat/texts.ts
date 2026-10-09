import type { Locale } from '@/shared/lib/i18n/translations';

// Chat copy lives apart from shared/lib/i18n/translations on purpose: that file ships in the
// first-load JS and the chat is a separate chunk. ChatLauncher holds its own two strings.

export interface ChatTexts {
  title: string;
  label: string;
  close: string;
  welcome: string;
  suggestions: [string, string, string];
  suggestionsTitle: string;
  field: string;
  placeholder: string;
  send: string;
  typing: string;
  userRole: string;
  assistantRole: string;
  continueOnWhatsapp: string;
  code: string;
  fallback: string;
  fallbackNoWhatsapp: string;
  footerPrices: string;
  footerClosing: string;
  characters: (n: number, max: number) => string;
}

export const CHAT_TEXTS: Record<Locale, ChatTexts> = {
  es: {
    title: 'AIworks',
    label: 'Asistente · IA',
    close: 'Cerrar el chat',
    welcome:
      'Hola, soy el asistente de AIworks. Le cuento qué construimos, cuánto cuesta y, si quiere, le ayudo a agendar una llamada.',
    suggestions: [
      '¿Cuánto cuesta el asistente de WhatsApp?',
      '¿Qué es un sistema a medida?',
      'Quiero agendar una llamada',
    ],
    suggestionsTitle: 'Puede empezar por aquí',
    field: 'Su mensaje',
    placeholder: 'Escriba su pregunta',
    send: 'Enviar',
    typing: 'Escribiendo',
    userRole: 'Usted',
    assistantRole: 'Asistente',
    continueOnWhatsapp: 'Continuar por WhatsApp',
    code: 'Código',
    fallback:
      'No pudimos responder en este momento. Escríbanos por WhatsApp y le atendemos ahí.',
    fallbackNoWhatsapp: 'No pudimos responder en este momento. Intente de nuevo en unos segundos.',
    footerPrices: 'Los valores oficiales van en la proforma.',
    footerClosing: 'Este asistente lo construimos nosotros.',
    characters: (n, max) => `${n} de ${max} caracteres`,
  },
  en: {
    title: 'AIworks',
    label: 'Assistant · AI',
    close: 'Close the chat',
    welcome:
      "Hi, I'm the AIworks assistant. I can tell you what we build, what it costs and, if you like, help you book a call.",
    suggestions: [
      'How much does the WhatsApp assistant cost?',
      'What is a custom system?',
      'I want to book a call',
    ],
    suggestionsTitle: 'You can start here',
    field: 'Your message',
    placeholder: 'Type your question',
    send: 'Send',
    typing: 'Typing',
    userRole: 'You',
    assistantRole: 'Assistant',
    continueOnWhatsapp: 'Continue on WhatsApp',
    code: 'Code',
    fallback: "We couldn't answer right now. Message us on WhatsApp and we'll help you there.",
    fallbackNoWhatsapp: "We couldn't answer right now. Please try again in a few seconds.",
    footerPrices: 'Official prices are in the quote.',
    footerClosing: 'We built this assistant ourselves.',
    characters: (n, max) => `${n} of ${max} characters`,
  },
};

// The demo speaks as the business, not as AIworks.
export const DEMO_TEXTS: Record<
  Locale,
  { welcome: (business: string) => string; suggestions: [string, string, string] }
> = {
  es: {
    welcome: (business) => `Hola, le habla el asistente de ${business}. ¿En qué le puedo ayudar?`,
    suggestions: [
      '¿Qué productos o servicios ofrecen?',
      '¿Cuál es su horario de atención?',
      '¿Cómo puedo contactarlos?',
    ],
  },
  en: {
    welcome: (business) => `Hi, this is the ${business} assistant. How can I help you?`,
    suggestions: [
      'What products or services do you offer?',
      'What are your opening hours?',
      'How can I get in touch?',
    ],
  },
};
