'use client';

import { Container } from '@/shared/components/ui/Container';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

export function Footer() {
  const { t, locale } = useTranslation();

  const navigationLinks = [
    { label: t.header.nav.procesos, href: '#procesos' },
    { label: t.header.nav.proceso, href: '#proceso' },
    { label: t.header.nav.porque, href: '#porque' },
    { label: t.header.nav.preguntas, href: '#preguntas' },
    { label: t.header.nav.contacto, href: '#contacto' },
  ];

  const whatsappUrl = enlaceWhatsApp(locale);
  const whatsappAriaLabel = `${t.footer.contacto.whatsapp} ${avisoPestanaNueva(locale)}`;

  return (
    <footer className="bg-[var(--papel)] border-t border-[var(--regla)] pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Marca */}
          <div className="space-y-3">
            <h3 className="text-[length:var(--paso-1)] font-semibold text-[var(--tinta)]">
              {t.footer.brand.name}
            </h3>
            <p className="medida text-[length:var(--paso--1)] text-[var(--tinta-media)] leading-relaxed">
              {t.footer.brand.description}
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold text-[var(--tinta)] mb-4">{t.footer.navegacion.title}</h4>
            <nav aria-label={locale === 'en' ? 'Footer navigation' : 'Navegación del pie'}>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="enlace text-[length:var(--paso--1)]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-[var(--tinta)] mb-4">{t.footer.contacto.title}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={whatsappAriaLabel}
                  className="enlace text-[length:var(--paso--1)]"
                >
                  {t.footer.contacto.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="enlace text-[length:var(--paso--1)]">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--regla)] pt-8">
          <p className="text-[length:var(--paso--1)] text-[var(--tinta-media)]">{t.footer.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
