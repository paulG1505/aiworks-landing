import dynamic from 'next/dynamic';
// Direct import for above-the-fold content (bundle-barrel-imports)
import { Hero } from '@/features/hero/components/Hero';

// Dynamic imports for below-the-fold sections (bundle-dynamic-imports)
const Servicios = dynamic(
  () => import('@/features/servicios/components/Servicios').then((mod) => ({ default: mod.Servicios })),
  { loading: () => <div className="min-h-[400px]" /> }
);

const Tecnologias = dynamic(
  () => import('@/features/tecnologias/components/Tecnologias').then((mod) => ({ default: mod.Tecnologias })),
  { loading: () => <div className="min-h-[400px]" /> }
);

const Proyectos = dynamic(
  () => import('@/features/proyectos/components/Proyectos').then((mod) => ({ default: mod.Proyectos })),
  { loading: () => <div className="min-h-[400px]" /> }
);

const WhyUs = dynamic(
  () => import('@/features/why-us/components/WhyUs').then((mod) => ({ default: mod.WhyUs })),
  { loading: () => <div className="min-h-[400px]" /> }
);

const Proceso = dynamic(
  () => import('@/features/proceso/components/Proceso').then((mod) => ({ default: mod.Proceso })),
  { loading: () => <div className="min-h-[400px]" /> }
);

const CTAFinal = dynamic(
  () => import('@/features/cta-final/components/CTAFinal').then((mod) => ({ default: mod.CTAFinal })),
  { loading: () => <div className="min-h-[400px]" /> }
);

export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <Tecnologias />
      <Proyectos />
      <WhyUs />
      <Proceso />
      <CTAFinal />
    </>
  );
}
