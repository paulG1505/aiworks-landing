import Script from 'next/script';

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AIworks",
    "url": "https://aiworks.dev",
    "logo": "https://aiworks.dev/logo.png",
    "description": "Empresa líder en desarrollo de software con inteligencia artificial, chatbots IA y automatización empresarial",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MX",
      "addressLocality": "México"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      "https://twitter.com/aiworks",
      "https://linkedin.com/company/aiworks"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Desarrollo de Software con Inteligencia Artificial",
    "provider": {
      "@type": "Organization",
      "name": "AIworks",
      "url": "https://aiworks.dev"
    },
    "areaServed": {
      "@type": "Country",
      "name": "México"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de IA",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desarrollo de Chatbots con IA",
            "description": "Chatbots inteligentes personalizados con procesamiento de lenguaje natural"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Automatización con IA",
            "description": "Automatización de procesos empresariales usando machine learning"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Análisis de Datos con IA",
            "description": "Transformación de datos en insights accionables con inteligencia artificial"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoría en IA",
            "description": "Asesoría experta en implementación de soluciones de inteligencia artificial"
          }
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://aiworks.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Servicios",
        "item": "https://aiworks.dev/#servicios"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Proyectos",
        "item": "https://aiworks.dev/#proyectos"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contacto",
        "item": "https://aiworks.dev/#contacto"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es un chatbot con inteligencia artificial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Un chatbot con IA es un asistente virtual que utiliza procesamiento de lenguaje natural y machine learning para entender y responder conversaciones de forma inteligente, aprendiendo continuamente de las interacciones."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo toma desarrollar una solución de IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El tiempo de desarrollo varía según la complejidad del proyecto. Un chatbot básico puede estar listo en 4-6 semanas, mientras que soluciones más complejas de automatización con IA pueden tomar 3-6 meses."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué industrias se benefician más de la IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Todas las industrias pueden beneficiarse de la IA. Destacamos en Fintech (análisis de riesgo, detección de fraude), Retail (recomendaciones personalizadas), Logística (optimización de rutas) y Salud (diagnóstico asistido)."
        }
      },
      {
        "@type": "Question",
        "name": "¿Ofrecen consultoría en inteligencia artificial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, ofrecemos consultoría gratuita inicial para evaluar cómo la IA puede transformar tu negocio, seguida de consultoría especializada durante todo el proceso de implementación."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
