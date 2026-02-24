export const en = {
  header: {
    logo: "AIworks",
    nav: {
      services: "Services",
      technologies: "Technologies",
      about: "About",
      process: "Process",
      contact: "Contact",
    },
    cta: "Schedule free consultation",
  },
  hero: {
    headline: "Transform your data into automated decisions with AI",
    subtitle: "Specialists in AI-powered software for companies seeking competitive advantage",
    cta: {
      primary: "Schedule free consultation",
      secondary: "Learn more",
    },
    industries: {
      fintech: "Fintech",
      retail: "Retail",
      logistics: "Logistics",
      healthcare: "Healthcare",
    },
  },
  services: {
    title: "AI Solutions that drive your business",
    subtitle: "We implement artificial intelligence in critical processes of your company",
    cards: {
      fintech: {
        title: "Fintech: Fraud Detection",
        problem: "Problem: Million-dollar losses from fraudulent transactions",
        solution: "Solution: ML system that analyzes patterns in real-time with 99.2% accuracy",
        benefit: "85% fraud reduction",
      },
      retail: {
        title: "Retail: Demand Forecasting",
        problem: "Problem: Obsolete inventory or stock shortages in key products",
        solution: "Solution: Forecasting with neural networks that predicts demand by SKU",
        benefit: "40% less waste",
      },
      logistics: {
        title: "Logistics: Route Optimization",
        problem: "Problem: High fuel costs and slow delivery times",
        solution: "Solution: Optimization algorithms that calculate routes in real-time",
        benefit: "30% fuel savings",
      },
      healthcare: {
        title: "Healthcare: Medical Image Analysis",
        problem: "Problem: Delayed diagnoses in X-ray analysis",
        solution: "Solution: Computer Vision that detects anomalies with specialist-level accuracy",
        benefit: "95% diagnostic accuracy",
      },
    },
  },
  technologies: {
    title: "Cutting-edge Technologies",
    subtitle: "Modern and scalable technology stack",
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
      title: "Infrastructure",
      items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
    },
  },
  projects: {
    title: "Artificial Intelligence applied to your business",
    subtitle: "We implement AI models that solve real problems and generate measurable ROI",
    cards: {
      dataAnalysis: {
        title: "Data Analysis with AI",
        description:
          "We analyze your data to identify patterns and opportunities. We select and implement the most suitable AI models according to your business objectives and data type.",
        solutionsLabel: "Solutions:",
        solutions: "Predictive analysis • Forecasting • Segmentation • Anomaly detection",
      },
      aiIntegration: {
        title: "AI Integration in your Software",
        description:
          "We integrate existing AI solutions (OpenAI, Anthropic, Google AI) into your applications. We develop intelligent interfaces and automated workflows adapted to your processes.",
        solutionsLabel: "Solutions:",
        solutions: "Conversational chatbots • AI assistants • NLP processing • Computer Vision",
      },
    },
  },
  whyUs: {
    title: "Why AIworks?",
    subtitle: "Competitive advantages that set us apart",
    cards: {
      fast: {
        title: "Fast implementation",
        description: "From concept to production in weeks, not months",
      },
      security: {
        title: "Enterprise security",
        description: "SOC 2, GDPR compliance and best practices",
      },
      quality: {
        title: "Quality code",
        description: "100% tested, documented and maintainable",
      },
      team: {
        title: "Expert team",
        description: "Senior developers specialized in AI/ML",
      },
    },
  },
  process: {
    title: "How we work",
    subtitle: "Proven 5-step methodology",
    steps: {
      discovery: {
        title: "Discovery and analysis",
        description:
          "We understand your business, available data and objectives. We evaluate technical feasibility.",
      },
      design: {
        title: "Solution design",
        description: "Technical architecture, model selection, and implementation roadmap.",
      },
      development: {
        title: "Development and training",
        description: "Agile development with 2-week sprints. Iterative ML model training.",
      },
      testing: {
        title: "Testing and validation",
        description: "Exhaustive testing (unit, integration, E2E). Business metrics validation.",
      },
      deployment: {
        title: "Deploy and monitoring",
        description:
          "Production deployment with CI/CD. Continuous performance monitoring and retraining.",
      },
    },
  },
  cta: {
    title: "Ready to transform your business with AI?",
    description: "Schedule a free 30-minute consultation with our AI experts",
    button: "Schedule consultation",
    form: {
      title: "Contact form",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send",
    },
  },
  footer: {
    brand: {
      name: "AIworks",
      description: "Consulting firm specialized in AI-powered software",
    },
    navigation: {
      title: "Navigation",
      services: "Services",
      technologies: "Technologies",
      about: "About",
      contact: "Contact",
    },
    legal: {
      title: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms and Conditions",
    },
    copyright: "© 2026 AIworks. All rights reserved.",
  },
} as const;
