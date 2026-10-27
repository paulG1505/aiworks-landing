import Script from 'next/script';
import { SITE_URL } from '@/shared/constants/site';
import { CONTACT_INFO } from '@/shared/constants';
import { es } from '@/shared/lib/i18n/translations/es';

// Only declare what the visible page says; the FAQ matches the Spanish copy word for word.
export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIworks',
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description:
      'Consultora de software que automatiza procesos de back office con inteligencia artificial, con revisión humana y registro auditable de cada decisión.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC',
      addressLocality: 'Quito',
    },
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      email: CONTACT_INFO.email,
      telephone: CONTACT_INFO.phone,
      availableLanguage: ['Spanish', 'English'],
    },
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Desarrollo de software con inteligencia artificial',
    provider: { '@type': 'Organization', name: 'AIworks', url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Ecuador' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Qué construimos',
      itemListElement: [
        ...es.services.items.map((item) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item.title,
            description: item.description,
          },
        })),
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Asistente de WhatsApp' },
          price: '169',
          priceCurrency: 'USD',
          description: 'Instalación de fundador, más IVA',
        },
      ],
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: es.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <Script
        id="ld-organizacion"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <Script
        id="ld-servicio"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Script
        id="ld-preguntas"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
