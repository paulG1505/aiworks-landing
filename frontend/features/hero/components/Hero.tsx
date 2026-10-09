'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ArrowUpRight } from 'lucide-react';
import { useUIStore } from '@/shared/store/useUIStore';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';
import { OperationsLog } from './OperationsLog';

type DelayStyle = React.CSSProperties & { '--d': string };
const delay = (ms: number): DelayStyle => ({ '--d': `${ms}ms` });

export function Hero() {
  const { t, locale } = useTranslation();
  const openChat = useUIStore((s) => s.openChat);
  const { category } = t.hero;

  return (
    <section className="pt-28 pb-24 sm:pt-36 lg:pt-48 lg:pb-40">
      <Container className="xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end xl:gap-16">
        <div className="flex max-w-[900px] flex-col gap-4 sm:gap-6">
          <h1 className="display-heading">
            <span className="line-mask enter-mask">
              <span className="line text-tinta-media" style={delay(100)}>
                {category.before}
                <span className="highlight">{category.highlight}</span>
                {category.after}
              </span>
            </span>
            <span className="line-mask enter-mask">
              <span className="line" style={delay(220)}>
                {t.hero.benefit}
              </span>
            </span>
          </h1>

          <div className="enter-reveal flex flex-col gap-6 sm:gap-10" style={delay(420)}>
            <p className="measure mt-2 text-[1.125rem] text-tinta-media lg:text-[1.3125rem]">{t.hero.subtitle}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button
                id="assistant-cta"
                type="button"
                onClick={openChat}
                aria-haspopup="dialog"
                className="action action-primary cursor-pointer"
              >
                {t.hero.cta.primary}
              </button>
              <a
                href={whatsappLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.hero.cta.whatsapp} ${newTabNotice(locale)}`}
                className="group inline-flex items-center gap-2 self-center p-2 text-base font-medium text-tinta sm:self-auto sm:p-0 sm:text-[1.0625rem]"
              >
                <span className="link">{t.hero.cta.whatsapp}</span>
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <p className="text-[0.9375rem] text-tinta-media">{t.hero.trackRecord}</p>
          </div>
        </div>

        <div className="mt-12 max-w-[760px] lg:mt-16 xl:mt-0 xl:max-w-none">
          <OperationsLog startMs={700} />
        </div>
      </Container>
    </section>
  );
}
