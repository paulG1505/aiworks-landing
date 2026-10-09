import dynamic from 'next/dynamic';
import { Hero } from '@/features/hero/components/Hero';
import { ScrollToAnchor } from '@/shared/components/providers/ScrollToAnchor';

// No loading placeholder: a reserved min-height box would cause a layout shift once the
// section loads.
const Services = dynamic(
  () => import('@/features/services/components/Services').then((mod) => ({ default: mod.Services })),
  { loading: () => null }
);

const Processes = dynamic(
  () => import('@/features/processes/components/Processes').then((mod) => ({ default: mod.Processes })),
  { loading: () => null }
);

const Process = dynamic(
  () => import('@/features/process/components/Process').then((mod) => ({ default: mod.Process })),
  { loading: () => null }
);

const WhyUs = dynamic(
  () => import('@/features/why-us/components/WhyUs').then((mod) => ({ default: mod.WhyUs })),
  { loading: () => null }
);

const Faq = dynamic(
  () => import('@/features/faq/components/Faq').then((mod) => ({ default: mod.Faq })),
  { loading: () => null }
);

const FinalCta = dynamic(
  () => import('@/features/final-cta/components/FinalCta').then((mod) => ({ default: mod.FinalCta })),
  { loading: () => null }
);

export default function Home() {
  return (
    <>
      <ScrollToAnchor />
      <Hero />
      <Services />
      <Processes />
      <Process />
      <WhyUs />
      <Faq />
      <FinalCta />
    </>
  );
}
