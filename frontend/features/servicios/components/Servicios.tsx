'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { ServicesGrid } from './ServicesGrid';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Servicios() {
  const { t } = useTranslation();

  return (
    <section id="servicios" className="py-20 lg:py-32">
      <Container>
        <SectionHeader
          title={t.services.title}
          description={t.services.subtitle}
          useGradient
        />
        <ServicesGrid />
      </Container>
    </section>
  );
}
