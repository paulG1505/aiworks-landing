import type { Locale } from '@/shared/lib/i18n/translations';

/**
 * Copy del chat. Vive aparte de `shared/lib/i18n/translations` a propósito: ese archivo
 * entra completo al JS de la primera carga, y el chat (que se descarga solo al hacer clic)
 * no debe engordarlo. Este módulo solo lo importa el panel, que es un chunk aparte.
 * El lanzador, que sí va en la primera carga, tiene sus dos frases en `ChatLauncher`.
 */
export interface TextosChat {
  titulo: string;
  etiqueta: string;
  cerrar: string;
  bienvenida: string;
  sugerencias: [string, string, string];
  sugerenciasTitulo: string;
  campo: string;
  placeholder: string;
  enviar: string;
  escribiendo: string;
  rolUsuario: string;
  rolAsistente: string;
  continuarWhatsapp: string;
  codigo: string;
  respaldo: string;
  respaldoSinWhatsapp: string;
  pieValores: string;
  pieCierre: string;
  caracteres: (n: number, max: number) => string;
}

export const TEXTOS_CHAT: Record<Locale, TextosChat> = {
  es: {
    titulo: 'AIworks',
    etiqueta: 'Asistente · IA',
    cerrar: 'Cerrar el chat',
    bienvenida:
      'Hola, soy el asistente de AIworks. Le cuento qué construimos, cuánto cuesta y, si quiere, le ayudo a agendar una llamada.',
    sugerencias: [
      '¿Cuánto cuesta el asistente de WhatsApp?',
      '¿Qué es un sistema a medida?',
      'Quiero agendar una llamada',
    ],
    sugerenciasTitulo: 'Puede empezar por aquí',
    campo: 'Su mensaje',
    placeholder: 'Escriba su pregunta',
    enviar: 'Enviar',
    escribiendo: 'Escribiendo',
    rolUsuario: 'Usted',
    rolAsistente: 'Asistente',
    continuarWhatsapp: 'Continuar por WhatsApp',
    codigo: 'Código',
    respaldo:
      'No pudimos responder en este momento. Escríbanos por WhatsApp y le atendemos ahí.',
    respaldoSinWhatsapp: 'No pudimos responder en este momento. Intente de nuevo en unos segundos.',
    pieValores: 'Los valores oficiales van en la proforma.',
    pieCierre: 'Este asistente lo construimos nosotros.',
    caracteres: (n, max) => `${n} de ${max} caracteres`,
  },
  en: {
    titulo: 'AIworks',
    etiqueta: 'Assistant · AI',
    cerrar: 'Close the chat',
    bienvenida:
      "Hi, I'm the AIworks assistant. I can tell you what we build, what it costs and, if you like, help you book a call.",
    sugerencias: [
      'How much does the WhatsApp assistant cost?',
      'What is a custom system?',
      'I want to book a call',
    ],
    sugerenciasTitulo: 'You can start here',
    campo: 'Your message',
    placeholder: 'Type your question',
    enviar: 'Send',
    escribiendo: 'Typing',
    rolUsuario: 'You',
    rolAsistente: 'Assistant',
    continuarWhatsapp: 'Continue on WhatsApp',
    codigo: 'Code',
    respaldo: "We couldn't answer right now. Message us on WhatsApp and we'll help you there.",
    respaldoSinWhatsapp: "We couldn't answer right now. Please try again in a few seconds.",
    pieValores: 'Official prices are in the quote.',
    pieCierre: 'We built this assistant ourselves.',
    caracteres: (n, max) => `${n} of ${max} characters`,
  },
};

/** Sugerencias y bienvenida de la demo: hablan como el negocio, no como AIworks. */
export const TEXTOS_DEMO: Record<
  Locale,
  { bienvenida: (negocio: string) => string; sugerencias: [string, string, string] }
> = {
  es: {
    bienvenida: (negocio) => `Hola, le habla el asistente de ${negocio}. ¿En qué le puedo ayudar?`,
    sugerencias: [
      '¿Qué productos o servicios ofrecen?',
      '¿Cuál es su horario de atención?',
      '¿Cómo puedo contactarlos?',
    ],
  },
  en: {
    bienvenida: (negocio) => `Hi, this is the ${negocio} assistant. How can I help you?`,
    sugerencias: [
      'What products or services do you offer?',
      'What are your opening hours?',
      'How can I get in touch?',
    ],
  },
};
