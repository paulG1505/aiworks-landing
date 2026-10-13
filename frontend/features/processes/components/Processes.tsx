'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { ProcessRow } from './ProcessRow';

export function Processes() {
  const { t, locale } = useTranslation();
  const reveal = useReveal<HTMLOListElement>();

  return (
    <section id="procesos" className="section">
      <Container>
        <SectionHeading
          number="02"
          eyebrow={t.processes.eyebrow}
          title={t.processes.title}
          intro={t.processes.subtitle}
        />

        <ol {...reveal} className="mt-14 border-b border-regla lg:mt-[72px]">
          {t.processes.items.map((item, index) => (
            <ProcessRow
              key={item.number}
              index={index}
              number={item.number}
              title={item.title}
              today={item.today}
              solution={item.solution}
              ctaLabel={t.processes.itemCta}
              locale={locale}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
