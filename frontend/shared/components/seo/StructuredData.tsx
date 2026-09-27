import Script from 'next/script';
import { SITE_URL } from '@/shared/constants/site';
import { CONTACT_INFO } from '@/shared/constants';

/**
 * Datos estructurados. Regla que ordena este archivo: **solo se declara lo que la
 * página dice de verdad.**
 *
 * La versión anterior al rediseño declaraba un catálogo de cuatro servicios
 * genéricos ("Análisis de Datos con IA", "Consultoría en IA") y un FAQ que
 * prometía capacidades por industria —"Fintech (análisis de riesgo, detección de
 * fraude), Retail (recomendaciones personalizadas), Logística (optimización de
 * rutas), Salud (diagnóstico asistido)"— que el contenido visible nunca afirmó.
 * Era la misma clase de afirmación sin respaldo que este cambio retira del texto,
 * escondida en el JSON-LD: mal para Google, que exige que los datos estructurados
 * reflejen el contenido visible, y peor si un prospecto la lee.
 *
 * El FAQ de abajo es palabra por palabra el que ve el visitante en español.
 */
export function StructuredData() {
  const organizacion = {
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

  // Los tres procesos son exactamente los tres que el bloque "Procesos que se
  // automatizan" desarrolla en la página. Ni uno más.
  const servicio = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Automatización de procesos con inteligencia artificial',
    provider: { '@type': 'Organization', name: 'AIworks', url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'Ecuador' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Procesos que se automatizan',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Conciliación bancaria automatizada',
            description:
              'El sistema lee el extracto, cruza por referencia y monto, y deja en una cola aparte solo las partidas que no cuadran para revisión humana.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cierre de mes sin digitación',
            description:
              'Los documentos que llegan en correos, PDF y hojas de cálculo se leen al llegar y los datos entran una sola vez al sistema.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Atención a clientes fuera de horario',
            description:
              'Un asistente responde las consultas repetidas con la información real del negocio y deriva a una persona lo que no puede contestar.',
          },
        },
      ],
    },
  };

  const preguntas = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Depende del proceso y de cuánto haya que conectar. En el diagnóstico de 15 minutos le damos un rango concreto para su caso, sin compromiso.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto demora?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El descubrimiento toma entre una y dos semanas. Después, la primera versión funcionando sobre sus datos suele estar en semanas, no en meses, porque entregamos por partes.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué pasa si la IA se equivoca?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Por eso no decide sola en lo que importa. Los pasos sensibles pasan por una persona antes de ejecutarse, y cada decisión queda registrada con su hora, así se puede ver qué hizo el sistema y corregirlo.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué pasa con los datos de mi empresa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Se quedan donde usted decida, y firmamos confidencialidad antes de ver nada. Trabajamos bajo la Ley Orgánica de Protección de Datos Personales del Ecuador, y en el diagnóstico no necesitamos datos reales para decirle si el proceso se puede automatizar.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="ld-organizacion"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion) }}
      />
      <Script
        id="ld-servicio"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicio) }}
      />
      <Script
        id="ld-preguntas"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(preguntas) }}
      />
    </>
  );
}
