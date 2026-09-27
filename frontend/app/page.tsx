import dynamic from 'next/dynamic';
// Direct import for above-the-fold content (bundle-barrel-imports)
import { Hero } from '@/features/hero/components/Hero';

// Dynamic imports for below-the-fold sections (bundle-dynamic-imports)
// No placeholder here: a min-h-[400px] box reserves blank space and causes
// a layout shift when the section finally loads.
const Procesos = dynamic(
  () => import('@/features/procesos/components/Procesos').then((mod) => ({ default: mod.Procesos })),
  { loading: () => null }
);

const Proceso = dynamic(
  () => import('@/features/proceso/components/Proceso').then((mod) => ({ default: mod.Proceso })),
  { loading: () => null }
);

const Porque = dynamic(
  () => import('@/features/porque/components/Porque').then((mod) => ({ default: mod.Porque })),
  { loading: () => null }
);

const Preguntas = dynamic(
  () => import('@/features/preguntas/components/Preguntas').then((mod) => ({ default: mod.Preguntas })),
  { loading: () => null }
);

const CTAFinal = dynamic(
  () => import('@/features/cta-final/components/CTAFinal').then((mod) => ({ default: mod.CTAFinal })),
  { loading: () => null }
);

export default function Home() {
  return (
    <>
      <Hero />
      <Procesos />
      <Proceso />
      <Porque />
      <Preguntas />
      <CTAFinal />
    </>
  );
}
