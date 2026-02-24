'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { TechGrid } from './TechGrid';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Tecnologias() {
  const { t } = useTranslation();

  return (
    <section id="tecnologias" className="py-20 lg:py-32 bg-[var(--white-5)]">
      <Container>
        <SectionHeader
          title={t.technologies.title}
          description={t.technologies.subtitle}
        />
        <TechGrid />
      </Container>
    </section>
  );
}
