'use client';

import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * Pie: continúa la banda oscura del cierre, separado solo por un filete. Los datos de
 * contacto ya están justo encima, en el cierre, así que aquí no se repiten.
 */
export function Footer() {
  const { t } = useTranslation();

  const navigationLinks = [
    { label: t.header.nav.procesos, href: '#procesos' },
    { label: t.header.nav.proceso, href: '#proceso' },
    { label: t.header.nav.porque, href: '#porque' },
    { label: t.header.nav.preguntas, href: '#preguntas' },
    { label: t.header.nav.contacto, href: '#contacto' },
  ];

  return (
    <footer className="oscuro">
      <Container>
        <div className="flex flex-col gap-6 border-t border-[var(--regla-noche)] py-8 font-mono text-xs text-hueso-medio lg:flex-row lg:items-center lg:justify-between">
          <p>{t.footer.copyright}</p>

          <nav aria-label={t.footer.navegacion}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors duration-150 hover:text-hueso">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSelector />
        </div>
      </Container>
    </footer>
  );
}
