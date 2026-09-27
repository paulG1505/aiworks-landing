'use client';

import { Container } from '@/shared/components/ui/Container';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { CONTACT_INFO } from '@/shared/constants';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

export function CTAFinal() {
  const { t, locale } = useTranslation();

  // El export estático no tiene backend donde recibir envíos de formulario,
  // así que el CTA lleva directo a los canales reales: WhatsApp (donde
  // llegan las campañas) y correo como alternativa.
  const whatsappUrl = enlaceWhatsApp(locale);
  const whatsappAriaLabel = `${t.cta.whatsapp} ${avisoPestanaNueva(locale)}`;

  return (
    <section id="contacto" className="py-20 lg:py-32 bg-[var(--papel-hundido)]">
      <Container>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[length:var(--paso-3)] lg:text-[length:var(--paso-4)] text-[var(--tinta)]">
              {t.cta.title}
            </h2>
            <p className="medida text-[length:var(--paso-1)] text-[var(--tinta-media)]">
              {t.cta.description}
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={whatsappAriaLabel}
              className="accion accion-whatsapp"
            >
              {t.cta.whatsapp}
            </a>

            <p className="text-[var(--tinta-media)]">
              {t.cta.correoLabel}{' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="enlace">
                {CONTACT_INFO.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
