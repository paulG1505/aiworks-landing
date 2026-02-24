import {
  ShieldCheck,
  ShoppingBag,
  Route,
  Activity,
  CreditCard,
  Store,
  Truck,
  HeartPulse,
  BrainCircuit,
  Workflow,
  Zap,
  Shield,
  Code,
  Users
} from 'lucide-react';
import { Service, Industry, TechStack, ProcessStep, Benefit, Project, ContactInfo } from '@/shared/types';

// Industries
export const INDUSTRIES: Industry[] = [
  { icon: CreditCard, name: 'Fintech' },
  { icon: Store, name: 'Retail' },
  { icon: Truck, name: 'Logística' },
  { icon: HeartPulse, name: 'Salud' }
];

// Services
export const SERVICES: Service[] = [
  {
    icon: ShieldCheck,
    title: 'Fintech',
    problem: '¿Necesitas automatizar procesos financieros?',
    solution: 'Implementamos IA para detección de fraude, análisis de riesgo crediticio y automatización de operaciones.',
    benefit: 'Reducción de fraude hasta 90%'
  },
  {
    icon: ShoppingBag,
    title: 'Retail & E-commerce',
    problem: '¿Quieres aumentar tus ventas con recomendaciones inteligentes?',
    solution: 'Sistemas de recomendación con IA, optimización de inventario y análisis predictivo de demanda.',
    benefit: 'Incremento de ventas 35%'
  },
  {
    icon: Route,
    title: 'Logística',
    problem: '¿Costos altos de distribución y entregas tardías?',
    solution: 'Optimización de rutas con IA, predicción de demanda y automatización de gestión de flota.',
    benefit: 'Ahorro en costos 40%'
  },
  {
    icon: Activity,
    title: 'Salud',
    problem: '¿Diagnósticos lentos y gestión ineficiente de pacientes?',
    solution: 'IA para diagnóstico asistido, análisis de imágenes médicas y automatización de historias clínicas.',
    benefit: 'Precisión diagnóstica 95%'
  }
];

// Tech Stack
export const TECH_STACK: TechStack[] = [
  {
    category: 'Backend',
    technologies: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis']
  },
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand']
  },
  {
    category: 'IA & ML',
    technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Hugging Face']
  },
  {
    category: 'Infraestructura',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel']
  }
];

// Process Steps
export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Diagnóstico',
    description: 'Analizamos tu negocio y identificamos oportunidades de automatización con IA'
  },
  {
    number: 2,
    title: 'Propuesta',
    description: 'Diseñamos una solución personalizada con roadmap y estimación de ROI'
  },
  {
    number: 3,
    title: 'Desarrollo',
    description: 'Implementamos la solución con metodología ágil y entregas incrementales'
  },
  {
    number: 4,
    title: 'Integración',
    description: 'Conectamos la IA con tus sistemas existentes de forma transparente'
  },
  {
    number: 5,
    title: 'Optimización',
    description: 'Monitoreamos y mejoramos continuamente el rendimiento de la solución'
  }
];

// Projects
export const PROJECTS: Project[] = [
  {
    icon: BrainCircuit,
    title: 'Chatbots Inteligentes Personalizados',
    description: 'Desarrollo de chatbots con IA y procesamiento de lenguaje natural. Asistentes virtuales que entienden contexto, aprenden de conversaciones y automatizan atención al cliente 24/7.',
    tags: ['Chatbots IA', 'NLP', 'Automatización']
  },
  {
    icon: Workflow,
    title: 'Desarrollo de Software con IA',
    description: 'Creamos software empresarial potenciado con inteligencia artificial. Desde análisis predictivo hasta automatización de procesos, integramos IA en tus sistemas existentes.',
    tags: ['Machine Learning', 'Desarrollo IA', 'Integración API']
  }
];

// Why Us Benefits
export const WHY_US_BENEFITS: Benefit[] = [
  {
    icon: Zap,
    title: 'Implementación Rápida',
    description: 'Primeros resultados en 2-4 semanas con metodología ágil'
  },
  {
    icon: Shield,
    title: 'Seguridad Enterprise',
    description: 'Cumplimiento de estándares y protección de datos sensibles'
  },
  {
    icon: Code,
    title: 'Código de Calidad',
    description: 'Clean code, tests automatizados y documentación completa'
  },
  {
    icon: Users,
    title: 'Equipo Experto',
    description: 'Especialistas en IA, ML y desarrollo de software full-stack'
  }
];

// Contact Info
export const CONTACT_INFO: ContactInfo = {
  email: 'contacto@aiworks.dev',
  phone: '+52 55 1234 5678',
  whatsapp: '5215512345678',
  address: 'Ciudad de México, México',
  socials: {
    linkedin: 'https://linkedin.com/company/aiworks',
    github: 'https://github.com/aiworks',
    twitter: 'https://twitter.com/aiworks'
  }
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Tecnologías', href: '#tecnologias' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Contacto', href: '#contacto' }
];

// Footer Links
export const FOOTER_LINKS = {
  services: [
    { label: 'Fintech', href: '#servicios' },
    { label: 'Retail', href: '#servicios' },
    { label: 'Logística', href: '#servicios' },
    { label: 'Salud', href: '#servicios' }
  ],
  company: [
    { label: 'Sobre Nosotros', href: '#' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Blog', href: '#' },
    { label: 'Casos de Éxito', href: '#proyectos' }
  ],
  legal: [
    { label: 'Privacidad', href: '#' },
    { label: 'Términos', href: '#' },
    { label: 'Cookies', href: '#' }
  ]
};
