'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { FaqItem } from './FaqItem';

export function Faq() {
  const { t } = useTranslation();
  const reveal = useReveal();

  return (
    <section id="preguntas" className="section bg-arena [--c-regla:var(--regla-arena)]">
      <Container className="lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading
          number="05"
          eyebrow={t.faq.eyebrow}
          title={t.faq.title}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div {...reveal} className="mt-14 max-w-[760px] border-t border-[var(--c-regla)] lg:mt-2 lg:max-w-none">
          {t.faq.items.map((item, index) => (
            <FaqItem
              key={item.question}
              index={index}
              question={item.question}
              answer={item.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
