'use client';

import Link from 'next/link';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

const CLASE_ENLACE =
  'break-words text-[var(--hueso-tenue)] transition-colors duration-150 hover:text-hueso';

interface Enlace {
  label: string;
  href: string;
  externo?: boolean;
  ariaLabel?: string;
}

/**
 * Pie en cuatro columnas —Servicios, La empresa, Contacto, Legal— sobre la banda oscura
 * que continúa el cierre. Los enlaces a secciones van a "/#seccion" para que funcionen
 * también desde /privacidad. No hay fila de redes sociales hasta que existan perfiles.
 */
export function Footer() {
  const { t, locale } = useTranslation();

  const columnas: { titulo: string; enlaces: Enlace[] }[] = [
    {
      titulo: t.footer.columnas.servicios,
      enlaces: t.servicios.items.map((item) => ({ label: item.titulo, href: '/#servicios' })),
    },
    {
      titulo: t.footer.columnas.empresa,
      enlaces: [
        { label: t.header.nav.procesos, href: '/#procesos' },
        { label: t.header.nav.proceso, href: '/#proceso' },
        { label: t.header.nav.porque, href: '/#porque' },
        { label: t.footer.ejemplos, href: '/#ejemplos' },
        { label: t.header.nav.preguntas, href: '/#preguntas' },
      ],
    },
    {
      titulo: t.footer.columnas.contacto,
      enlaces: [
        {
          label: 'WhatsApp',
          href: enlaceWhatsApp(locale),
          externo: true,
          ariaLabel: `WhatsApp ${avisoPestanaNueva(locale)}`,
        },
        { label: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
        { label: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
      ],
    },
    {
      titulo: t.footer.columnas.legal,
      enlaces: [{ label: t.footer.privacidad, href: '/privacidad' }],
    },
  ];

  return (
    <footer className="oscuro">
      <Container>
        <div className="grid grid-cols-1 gap-12 border-t border-[var(--regla-noche)] py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-titular text-2xl font-semibold tracking-[-0.02em] text-hueso">
              {t.header.logo}
            </Link>
            <p className="max-w-[32ch] text-[0.9375rem] text-hueso-medio">{t.footer.descripcion}</p>
          </div>

          {columnas.map((columna) => (
            <nav key={columna.titulo} aria-label={columna.titulo} className="flex flex-col gap-4">
              <h2 className="eyebrow">{columna.titulo}</h2>
              <ul className="flex flex-col gap-2.5 text-[0.9375rem]">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.label}>
                    {enlace.href.startsWith('/') ? (
                      <Link href={enlace.href} className={CLASE_ENLACE}>
                        {enlace.label}
                      </Link>
                    ) : (
                      <a
                        href={enlace.href}
                        {...(enlace.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        aria-label={enlace.ariaLabel}
                        className={CLASE_ENLACE}
                      >
                        {enlace.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--regla-noche)] py-6 font-mono text-[0.8125rem] text-hueso-medio sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <LanguageSelector />
        </div>
      </Container>
    </footer>
  );
}
