import type { Locale } from '@/shared/lib/i18n/translations';
import type { DemoSector } from './data/sectorDemos';

interface DemoPageCopy {
  loading: string;
  unavailable: string;
  unavailableText: string;
  error: string;
  errorText: string;
  retryLoad: string;
  whatsapp: string;
  genericMessage: string;
  prepared: string;
  expires: (date: string) => string;
  resting: string;
  publicInfoOnly: string;
  sourceFallback: string;
  exampleCompany: string;
  sectorLabel: Record<DemoSector, string>;
  sectorBanner: string;
  book: string;
  bookShort: string;
  bookNote: string;
  price: string;
  sectorMessageSubject: (business: string) => string;
  disclaimer: {
    line: (name: string) => string;
    toggle: string;
    sourceBefore: string;
    consultedOn: (date: string) => string;
    sourceAfter: string;
    notAffiliated: (name: string) => string;
    example: string;
    takedownIntro: (name: string) => string;
    takedownAction: string;
  };
  gallery: {
    title: string;
    intro: string;
    sectorDescription: Record<DemoSector, string>;
    open: string;
    askOwn: string;
    askOwnText: string;
    askOwnMessage: string;
  };
}

export const DEMO_PAGE_COPY: Record<Locale, DemoPageCopy> = {
  es: {
    loading: 'Preparando su demo…',
    unavailable: 'Esta demo ya no está disponible',
    unavailableText: 'Escríbanos por WhatsApp y le preparamos una nueva.',
    error: 'No pudimos cargar la demo',
    errorText: 'Intente de nuevo en unos minutos o escríbanos por WhatsApp.',
    retryLoad: 'Reintentar',
    whatsapp: 'Escribirnos por WhatsApp',
    genericMessage: 'Hola, quisiera una demo de un asistente de WhatsApp para mi negocio.',
    prepared: 'Demo preparada para',
    expires: (date) => `vence el ${date}`,
    resting: 'descansando por hoy',
    publicInfoOnly: 'Solo información pública de',
    sourceFallback: 'la web del negocio',
    exampleCompany: 'Empresa de ejemplo',
    sectorLabel: {
      comercio: 'Comercio',
      salud: 'Salud',
      finanzas: 'Finanzas',
      logistica: 'Logística',
    },
    sectorBanner:
      'Es un ejemplo del sector, con datos inventados. No es la demo de un cliente.',
    book: 'Agendar diagnóstico de 15 minutos',
    bookShort: 'Agendar 15 min',
    bookNote: 'Sin costo. Le respondemos por WhatsApp.',
    price: 'Instalación USD 300 + IVA (precio de fundador) · planes desde USD 45 + IVA al mes',
    sectorMessageSubject: (business) => `${business} (empresa de ejemplo)`,
    disclaimer: {
      line: (name) => `Demostración independiente de AIworks. No es un canal oficial de ${name} ni está afiliada a ellos.`,
      toggle: 'Sobre esta demostración',
      sourceBefore: 'AIworks preparó esta demostración por su cuenta, solo con información pública de',
      consultedOn: (date) => `, consultada el ${date}`,
      sourceAfter: '. Puede estar desactualizada o incompleta.',
      notAffiliated: (name) =>
        `${name} no participó, no la revisó ni la respalda. No se usan sus logotipos ni sus marcas gráficas.`,
      example:
        'Es un ejemplo de cómo podría atender un asistente de este tipo. Si decide contratarlo, lo construimos con su información oficial.',
      takedownIntro: (name) =>
        `Si usted representa a ${name} y prefiere que retiremos esta demostración, escríbanos y la damos de baja.`,
      takedownAction: 'Pedir que la retiren',
    },
    gallery: {
      title: 'Pruebe una demo de su sector',
      intro: 'Cuatro empresas de ejemplo, con datos inventados. Elija la que más se parezca a su negocio y pregúntele lo que le preguntaría un cliente.',
      sectorDescription: {
        comercio: 'Envíos, cambios, formas de pago y retiro en bodega.',
        salud: 'Citas, especialidades, seguros y emergencias.',
        finanzas: 'Hacerse socio, créditos, ahorro y agencias.',
        logistica: 'Tarifas, plazos, rastreo por guía y recolección.',
      },
      open: 'Probar',
      askOwn: 'Pida la suya',
      askOwnText: '¿Quiere ver su propio negocio? Le preparamos una demo con su información pública.',
      askOwnMessage: 'Hola, vi las demos de ejemplo y quisiera una demo para mi negocio.',
    },
  },
  en: {
    loading: 'Preparing your demo…',
    unavailable: 'This demo is no longer available',
    unavailableText: "Message us on WhatsApp and we'll set up a new one.",
    error: "We couldn't load the demo",
    errorText: 'Try again in a few minutes or message us on WhatsApp.',
    retryLoad: 'Try again',
    whatsapp: 'Message us on WhatsApp',
    genericMessage: "Hi, I'd like a demo of a WhatsApp assistant for my business.",
    prepared: 'Demo prepared for',
    expires: (date) => `expires ${date}`,
    resting: 'resting for today',
    publicInfoOnly: 'Public information only from',
    sourceFallback: "the business's website",
    exampleCompany: 'Example company',
    sectorLabel: {
      comercio: 'Retail',
      salud: 'Health',
      finanzas: 'Finance',
      logistica: 'Logistics',
    },
    sectorBanner: 'This is a sector example with made-up data. It is not a client demo.',
    book: 'Book a 15-minute assessment',
    bookShort: 'Book 15 min',
    bookNote: 'No cost. We reply on WhatsApp.',
    price: 'Setup USD 300 + VAT (founder price) · plans from USD 45 + VAT per month',
    sectorMessageSubject: (business) => `${business} (example company)`,
    disclaimer: {
      line: (name) => `Independent AIworks demo. It is not an official channel of ${name} and is not affiliated with them.`,
      toggle: 'About this demo',
      sourceBefore: 'AIworks prepared this demo on its own, using only public information from',
      consultedOn: (date) => `, accessed on ${date}`,
      sourceAfter: '. It may be outdated or incomplete.',
      notAffiliated: (name) =>
        `${name} did not take part, review or endorse it. Its logos and graphic marks are not used.`,
      example:
        'It is an example of how an assistant like this could serve customers. If you decide to hire one, we build it with your official information.',
      takedownIntro: (name) =>
        `If you represent ${name} and prefer that we take this demo down, write to us and we will remove it.`,
      takedownAction: 'Ask us to take it down',
    },
    gallery: {
      title: 'Try a demo from your sector',
      intro: 'Four example companies with made-up data. Pick the one closest to your business and ask what a customer would ask.',
      sectorDescription: {
        comercio: 'Delivery, returns, payment methods and warehouse pickup.',
        salud: 'Appointments, specialties, insurance and emergencies.',
        finanzas: 'Becoming a member, loans, savings and branches.',
        logistica: 'Rates, delivery times, tracking by waybill and pickup.',
      },
      open: 'Try it',
      askOwn: 'Ask for yours',
      askOwnText: 'Want to see your own business? We prepare a demo from your public information.',
      askOwnMessage: "Hi, I saw the example demos and I'd like a demo for my business.",
    },
  },
};
