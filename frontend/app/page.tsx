import dynamic from 'next/dynamic';
import { Hero } from '@/features/hero/components/Hero';
import { ScrollToAnchor } from '@/shared/components/providers/ScrollToAnchor';

const Services = dynamic(
  () => import('@/features/services/components/Services').then((mod) => ({ default: mod.Services })),
  { loading: () => null }
);

const Processes = dynamic(
  () => import('@/features/processes/components/Processes').then((mod) => ({ default: mod.Processes })),
  { loading: () => null }
);

const HowWeWork = dynamic(
  () => import('@/features/how-we-work/components/HowWeWork').then((mod) => ({ default: mod.HowWeWork })),
  { loading: () => null }
);

const Why = dynamic(
  () => import('@/features/why/components/Why').then((mod) => ({ default: mod.Why })),
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
      <HowWeWork />
      <Why />
      <Faq />
      <FinalCta />
    </>
  );
}
