import { Metadata } from 'next';
import { SITE_URL } from '@/shared/constants/site';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

/**
 * Generates SEO metadata for Next.js pages
 * Use this helper to create consistent, optimized metadata across the site
 */
export function generateSEO({
  title,
  description,
  keywords = [],
  image = '/og-image.png',
  url = SITE_URL,
  type = 'website'
}: SEOProps = {}): Metadata {
  const siteTitle = title
    ? `${title} | AIworks`
    : 'AIworks | Desarrollo de Software con Inteligencia Artificial y Chatbots';

  const siteDescription = description ||
    'Empresa líder en desarrollo de software con inteligencia artificial, chatbots IA y automatización empresarial. Creamos soluciones personalizadas con IA para Fintech, Retail, Logística y Salud.';

  const defaultKeywords = [
    'desarrollo software inteligencia artificial',
    'chatbots con IA',
    'chatbot inteligente',
    'automatización con IA',
    'machine learning',
    'procesamiento lenguaje natural'
  ];

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      type,
      locale: 'es_MX',
      url,
      title: siteTitle,
      description: siteDescription,
      siteName: 'AIworks',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'AIworks - Desarrollo de Software con IA',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [image],
      creator: '@aiworks',
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Common SEO keywords by topic
 * Use these to enhance page-specific metadata
 */
export const SEO_KEYWORDS = {
  chatbots: [
    'desarrollo chatbot personalizado',
    'chatbot inteligente empresarial',
    'chatbot WhatsApp IA',
    'asistente virtual IA',
    'bot conversacional'
  ],
  automation: [
    'automatización procesos IA',
    'RPA con inteligencia artificial',
    'automatización empresarial',
    'workflow automation AI'
  ],
  consulting: [
    'consultoría inteligencia artificial',
    'asesoría IA empresas',
    'implementación IA',
    'estrategia digital IA'
  ],
  industries: {
    fintech: [
      'IA para fintech',
      'detección fraude IA',
      'análisis riesgo crediticio',
      'fintech machine learning'
    ],
    retail: [
      'IA para retail',
      'recomendaciones personalizadas IA',
      'predicción demanda retail',
      'inventario inteligente'
    ],
    logistics: [
      'IA para logística',
      'optimización rutas IA',
      'gestión flota inteligente',
      'predicción entregas'
    ],
    health: [
      'IA para salud',
      'diagnóstico asistido IA',
      'análisis imágenes médicas',
      'telemedicina IA'
    ]
  }
};
