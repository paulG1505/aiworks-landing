'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { whatsappTextLink, newTabNotice } from '@/shared/lib/whatsapp';
import { PricingRow } from './PricingRow';

export function Pricing() {
  const { t, locale } = useTranslation();
  const reveal = useReveal<HTMLOListElement>();
  const { items, custom } = t.pricing;

  return (
    <section id="precios" className="section">
      <Container>
        <SectionHeading
          number="06"
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          intro={t.pricing.intro}
        />

        <ol {...reveal} className="mt-14 border-b border-regla lg:mt-[72px]">
          {items.map((item, index) => (
            <PricingRow
              key={item.name}
              index={index}
              name={item.name}
              amount={item.amount}
              detail={item.detail}
              locale={locale}
            />
          ))}
          <PricingRow
            index={items.length}
            name={custom.name}
            amount={custom.amount}
            detail={custom.detail}
            cta={{ label: custom.cta, message: custom.message }}
            locale={locale}
          />
        </ol>

        <div className="mt-10 flex flex-col items-start gap-6">
          <p className="measure text-tinta-media">{t.pricing.note}</p>
          <a
            href={whatsappTextLink(t.pricing.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.pricing.cta} ${newTabNotice(locale)}`}
            className="action action-primary w-full sm:w-auto"
          >
            {t.pricing.cta}
          </a>
        </div>
      </Container>
    </section>
  );
}
