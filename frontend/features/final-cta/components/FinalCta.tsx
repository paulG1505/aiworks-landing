'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { useReveal } from '@/shared/hooks/useReveal';
import { CONTACT_INFO } from '@/shared/constants';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';

type DelayStyle = React.CSSProperties & { '--d': string };
const delay = (ms: number): DelayStyle => ({ '--d': `${ms}ms` });

export function FinalCta() {
  const { t, locale } = useTranslation();
  const reveal = useReveal<HTMLElement>();

  return (
    <section id="contacto" {...reveal} className="dark-band curtain">
      <Container className="pb-24 pt-32 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16 lg:pb-40 lg:pt-[200px]">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow reveal" style={delay(300)}>
            <span>
              <span className="tabular">06</span> — {t.cta.eyebrow}
            </span>
          </p>

          <h2 className="max-w-[16ch] text-[clamp(2.25rem,1.3rem+3.8vw,4rem)] leading-[1.02] tracking-[-0.03em]">
            <span className="line-mask reveal-mask">
              <span className="line" style={delay(400)}>
                {t.cta.title.before}
              </span>
            </span>
            <span className="line-mask reveal-mask">
              <span className="line highlight" style={delay(520)}>
                {t.cta.title.highlight}
              </span>
            </span>
          </h2>
        </div>

        <div className="mt-6 flex flex-col items-start gap-6 lg:mt-0">
          <p className="measure reveal text-[var(--hueso-tenue)]" style={delay(640)}>
            {t.cta.description}
          </p>

          <a
            href={whatsappLink(locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.cta.whatsapp} ${newTabNotice(locale)}`}
            className="action action-primary reveal mt-4 w-full px-[32px] py-5 text-[1.1875rem] sm:mt-6 sm:w-auto lg:mt-2"
            style={delay(800)}
          >
            {t.cta.whatsapp}
          </a>

          <p
            className="reveal flex flex-col gap-2 font-mono text-[0.9375rem] text-hueso-medio sm:flex-row sm:flex-wrap sm:gap-6"
            style={delay(900)}
          >
            <span className="tabular">{CONTACT_INFO.phone}</span>
            <span>
              {t.cta.emailLabel}{' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="link break-all text-hueso">
                {CONTACT_INFO.email}
              </a>
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
