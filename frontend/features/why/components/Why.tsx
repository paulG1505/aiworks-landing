'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { ExamplesCarousel } from './ExamplesCarousel';

type DelayStyle = React.CSSProperties & { '--d': string };

export function Why() {
  const { t } = useTranslation();
  const principles = useReveal<HTMLUListElement>();
  const examples = useReveal();

  return (
    <section id="porque" className="section">
      <Container>
        <SectionHeading number="04" eyebrow={t.why.eyebrow} title={t.why.title} />

        <ul {...principles} className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-[72px]">
          {t.why.items.map((item, index) => (
            <li
              key={item.title}
              className="reveal flex flex-col gap-3 border-t border-tinta pt-5"
              style={{ '--d': `${index * 90}ms` } as DelayStyle}
            >
              <h3 className="text-[1.375rem] leading-[1.2] lg:text-[1.625rem]">{item.title}</h3>
              <p className="text-tinta-media">{item.description}</p>
            </li>
          ))}
        </ul>

        <div {...examples} id="ejemplos" className="mt-24 scroll-mt-24 lg:mt-32">
          <ExamplesCarousel
            title={t.why.examples.title}
            previous={t.why.examples.previous}
            next={t.why.examples.next}
            todayLabel={t.why.examples.todayLabel}
            withAiLabel={t.why.examples.withAiLabel}
            items={t.why.examples.items}
          />
        </div>
      </Container>
    </section>
  );
}
