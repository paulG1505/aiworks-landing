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
    <section id="procesos" className="seccion">
      <Container>
        <SectionHeading
          number="02"
          eyebrow={t.procesos.eyebrow}
          title={t.procesos.titulo}
          intro={t.procesos.subtitle}
        />

        <ol {...reveal} className="mt-14 border-b border-regla lg:mt-[72px]">
          {t.procesos.items.map((item, index) => (
            <ProcessRow
              key={item.numero}
              index={index}
              number={item.numero}
              title={item.titulo}
              today={item.hoy}
              solution={item.resuelve}
              ctaLabel={t.procesos.ctaItem}
              locale={locale}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
