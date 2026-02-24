'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { ProcessTimeline } from './ProcessTimeline';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Proceso() {
  const { t } = useTranslation();

  return (
    <section id="proceso" className="py-20 lg:py-32">
      <Container>
        <SectionHeader
          title={t.process.title}
          description={t.process.subtitle}
          useGradient
        />
        <ProcessTimeline />
      </Container>
    </section>
  );
}
