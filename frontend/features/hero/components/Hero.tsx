'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { ArrowRight } from 'lucide-react';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';
import { OperationalLog } from './OperationalLog';

type Delay = React.CSSProperties & { '--d': string };
const delay = (ms: number): Delay => ({ '--d': `${ms}ms` });

// The category is the first headline line and the benefit the second. With reduced motion
// everything is visible from the start.
export function Hero() {
  const { t, locale } = useTranslation();
  const { categoria } = t.hero;

  return (
    <section className="pt-28 pb-24 sm:pt-36 lg:pt-48 lg:pb-40">
      {/* From xl, two columns: headline and CTA on the left, log on the right. */}
      <Container className="xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:items-end xl:gap-16">
        <div className="flex max-w-[900px] flex-col gap-4 sm:gap-6">
          <h1 className="titular-display">
            <span className="linea-mascara entrada-mascara">
              <span className="linea text-tinta-media" style={delay(100)}>
                {categoria.antes}
                <span className="clave">{categoria.clave}</span>
                {categoria.despues}
              </span>
            </span>
            <span className="linea-mascara entrada-mascara">
              <span className="linea" style={delay(220)}>
                {t.hero.beneficio}
              </span>
            </span>
          </h1>

          <div className="entrada-revelar flex flex-col gap-6 sm:gap-10" style={delay(420)}>
            <p className="medida mt-2 text-[1.125rem] text-tinta-media lg:text-[1.3125rem]">{t.hero.subtitle}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <a
                href={whatsappLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.hero.cta.primary} ${newTabNotice(locale)}`}
                className="accion accion-primaria"
              >
                {t.hero.cta.primary}
              </a>
              <a
                href="#ejemplos"
                className="group inline-flex items-center gap-2 self-center p-2 text-base font-medium text-tinta sm:self-auto sm:p-0 sm:text-[1.0625rem]"
              >
                <span className="enlace">{t.hero.cta.ejemplos}</span>
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>

            <p className="text-[0.9375rem] text-tinta-media">{t.hero.trayectoria}</p>
          </div>
        </div>

        <div className="mt-12 max-w-[760px] lg:mt-16 xl:mt-0 xl:max-w-none">
          <OperationalLog startMs={700} />
        </div>
      </Container>
    </section>
  );
}
