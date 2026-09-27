'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';
import { RegistroOperativo } from './RegistroOperativo';

export function Hero() {
  const { t, locale } = useTranslation();

  const whatsappHref = enlaceWhatsApp(locale);

  return (
    <section className="pt-28 pb-12 sm:pt-32 sm:pb-16">
      <Container>
        <h1
          className="medida text-[length:var(--paso-4)] sm:text-[length:var(--paso-5)]"
        >
          {t.hero.headline}
        </h1>

        <p className="medida mt-6" style={{ color: 'var(--tinta-media)', fontSize: 'var(--paso-1)' }}>
          {t.hero.subtitle}
        </p>

        <p className="mt-4" style={{ color: 'var(--tinta-media)', fontSize: 'var(--paso-0)' }}>
          {t.hero.trayectoria}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.hero.cta.primary} ${avisoPestanaNueva(locale)}`}
            className="accion accion-whatsapp"
          >
            {t.hero.cta.primary}
          </a>
          <a href="#proceso" className="accion accion-secundaria">
            {t.hero.cta.secondary}
          </a>
        </div>

        <div className="mt-10 max-w-2xl">
          <RegistroOperativo />
        </div>

        <div className="mt-10">
          <p style={{ color: 'var(--tinta-media)', fontSize: 'var(--paso--1)' }}>
            {t.hero.sectores.label}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {t.hero.sectores.items.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
