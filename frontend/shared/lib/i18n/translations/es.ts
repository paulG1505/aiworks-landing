export const es = {
  header: {
    logo: "AIworks",
    nav: {
      services: "Servicios",
      technologies: "Tecnologías",
      about: "Nosotros",
      process: "Proceso",
      contact: "Contacto",
    },
    cta: "Agendar consulta gratuita",
  },
  hero: {
    headline: "Transforma tus datos en decisiones automatizadas con IA",
    subtitle: "Especialistas en software potenciado con IA para empresas que buscan ventaja competitiva",
    cta: {
      primary: "Agendar consulta gratuita",
      secondary: "Conocer más",
    },
    industries: {
      fintech: "Fintech",
      retail: "Retail",
      logistics: "Logística",
      healthcare: "Salud",
    },
  },
  services: {
    title: "Soluciones IA que impulsan tu negocio",
    subtitle: "Implementamos inteligencia artificial en procesos críticos de tu empresa",
    cards: {
      fintech: {
        title: "Fintech: Detección de Fraude",
        problem: "Problema: Pérdidas millonarias por transacciones fraudulentas",
        solution: "Solución: Sistema ML que analiza patrones en tiempo real con 99.2% de precisión",
        benefit: "85% reducción de fraude",
      },
      retail: {
        title: "Retail: Predicción de Demanda",
        problem: "Problema: Inventario obsoleto o faltantes en productos clave",
        solution: "Solución: Forecasting con redes neuronales que predice demanda por SKU",
        benefit: "40% menos desperdicio",
      },
      logistics: {
        title: "Logística: Optimización de Rutas",
        problem: "Problema: Altos costos de combustible y tiempos lentos de entrega",
        solution: "Solución: Algoritmos de optimización que calculan rutas en tiempo real",
        benefit: "30% ahorro en combustible",
      },
      healthcare: {
        title: "Salud: Análisis de Imágenes Médicas",
        problem: "Problema: Diagnósticos demorados en análisis de rayos X",
        solution: "Solución: Computer Vision que detecta anomalías con precisión de especialista",
        benefit: "95% precisión diagnóstica",
      },
    },
  },
  technologies: {
    title: "Tecnologías de Vanguardia",
    subtitle: "Stack tecnológico moderno y escalable",
    backend: {
      title: "Backend",
      items: ["FastAPI", "Python", "PostgreSQL", "Redis"],
    },
    frontend: {
      title: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    aiml: {
      title: "IA/ML",
      items: ["TensorFlow", "PyTorch", "scikit-learn", "LangChain"],
    },
    infrastructure: {
      title: "Infraestructura",
      items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
    },
  },
  projects: {
    title: "Inteligencia Artificial aplicada a tu negocio",
    subtitle: "Implementamos modelos IA que resuelven problemas reales y generan ROI medible",
    cards: {
      dataAnalysis: {
        title: "Análisis de Datos con IA",
        description:
          "Analizamos tus datos para identificar patrones y oportunidades. Seleccionamos e implementamos los modelos IA más adecuados según tus objetivos de negocio y tipo de datos.",
        solutionsLabel: "Soluciones:",
        solutions: "Análisis predictivo • Forecasting • Segmentación • Detección de anomalías",
      },
      aiIntegration: {
        title: "Integración IA en tu Software",
        description:
          "Integramos soluciones IA existentes (OpenAI, Anthropic, Google AI) en tus aplicaciones. Desarrollamos interfaces inteligentes y flujos de trabajo automatizados adaptados a tus procesos.",
        solutionsLabel: "Soluciones:",
        solutions: "Chatbots conversacionales • Asistentes IA • Procesamiento NLP • Computer Vision",
      },
    },
  },
  whyUs: {
    title: "¿Por qué AIworks?",
    subtitle: "Ventajas competitivas que nos diferencian",
    cards: {
      fast: {
        title: "Implementación rápida",
        description: "Del concepto a producción en semanas, no meses",
      },
      security: {
        title: "Seguridad empresarial",
        description: "Cumplimiento SOC 2, GDPR y mejores prácticas",
      },
      quality: {
        title: "Código de calidad",
        description: "100% testeado, documentado y mantenible",
      },
      team: {
        title: "Equipo experto",
        description: "Desarrolladores senior especializados en IA/ML",
      },
    },
  },
  process: {
    title: "Cómo trabajamos",
    subtitle: "Metodología probada de 5 pasos",
    steps: {
      discovery: {
        title: "Descubrimiento y análisis",
        description:
          "Entendemos tu negocio, datos disponibles y objetivos. Evaluamos viabilidad técnica.",
      },
      design: {
        title: "Diseño de solución",
        description: "Arquitectura técnica, selección de modelos y hoja de ruta de implementación.",
      },
      development: {
        title: "Desarrollo y entrenamiento",
        description: "Desarrollo ágil con sprints de 2 semanas. Entrenamiento iterativo de modelos ML.",
      },
      testing: {
        title: "Testing y validación",
        description: "Testing exhaustivo (unitario, integración, E2E). Validación de métricas de negocio.",
      },
      deployment: {
        title: "Deploy y monitoreo",
        description:
          "Despliegue a producción con CI/CD. Monitoreo continuo de performance y reentrenamiento.",
      },
    },
  },
  cta: {
    title: "¿Listo para transformar tu negocio con IA?",
    description: "Agenda una consulta gratuita de 30 minutos con nuestros expertos en IA",
    button: "Agendar consulta",
    form: {
      title: "Formulario de contacto",
      name: "Nombre",
      email: "Correo electrónico",
      message: "Mensaje",
      submit: "Enviar",
    },
  },
  footer: {
    brand: {
      name: "AIworks",
      description: "Consultora especializada en software potenciado con IA",
    },
    navigation: {
      title: "Navegación",
      services: "Servicios",
      technologies: "Tecnologías",
      about: "Nosotros",
      contact: "Contacto",
    },
    legal: {
      title: "Legal",
      privacy: "Política de Privacidad",
      terms: "Términos y Condiciones",
    },
    copyright: "© 2026 AIworks. Todos los derechos reservados.",
  },
} as const;
