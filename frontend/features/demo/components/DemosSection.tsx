'use client';

import { Container } from '@/shared/components/ui/Container';
import { SectionHeading } from '@/shared/components/ui/SectionHeading';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { CONTACT_INFO } from '@/shared/constants';
import { newTabNotice } from '@/shared/lib/whatsapp';
import { SECTOR_DEMOS } from '../data/sectorDemos';
import { DEMO_PAGE_COPY } from '../copy';
import { bookingUrl } from '../lib/demoView';

type DelayStyle = React.CSSProperties & { '--d': string };

export function DemosSection() {
  const { t, locale } = useTranslation();
  const copy = DEMO_PAGE_COPY[locale];
  const cards = useReveal<HTMLUListElement>();
  const askOwnHref = bookingUrl(CONTACT_INFO.whatsapp, copy.gallery.askOwnMessage);

  return (
    <section id="demos" className="section border-t border-regla">
      <Container>
        <SectionHeading number="05" eyebrow={t.demos.eyebrow} title={t.demos.title} intro={t.demos.intro} />

        <ul {...cards} className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:mt-[72px]">
          {SECTOR_DEMOS.map((demo, index) => (
            <li
              key={demo.slug}
              className="reveal border-t border-tinta"
              style={{ '--d': `${index * 90}ms` } as DelayStyle}
            >
              <a
                href={`/demo#${demo.slug}`}
                className="group flex min-h-11 items-start justify-between gap-6 py-6"
              >
                <span className="min-w-0">
                  <span className="tabular block text-[0.8125rem] uppercase tracking-[0.08em] text-tinta-media">
                    {copy.sectorLabel[demo.sector]}
                  </span>
                  <span className="mt-1 block font-display text-[1.375rem] font-semibold leading-tight text-tinta group-hover:text-marca">
                    {demo.businessName}
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] leading-snug text-tinta-media">
                    {copy.gallery.sectorDescription[demo.sector]}
                  </span>
                </span>
                <span className="shrink-0 text-[0.9375rem] font-medium text-marca underline decoration-1 underline-offset-4">
                  {copy.gallery.open}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-5 border-t border-regla pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-[1.1875rem] leading-snug text-tinta">{copy.gallery.askOwnText}</p>
          <a
            href={askOwnHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.gallery.askOwn} ${newTabNotice(locale)}`}
            className="action action-primary min-h-11"
          >
            {copy.gallery.askOwn}
          </a>
        </div>
      </Container>
    </section>
  );
}
