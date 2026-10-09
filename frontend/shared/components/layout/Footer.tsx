'use client';

import Link from 'next/link';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';

const LINK_CLASS =
  'break-words text-[var(--hueso-tenue)] transition-colors duration-150 hover:text-hueso';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

// Section links use "/#section" so they also work from /privacidad.

export function Footer() {
  const { t, locale } = useTranslation();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t.footer.columnas.servicios,
      links: t.servicios.items.map((item) => ({ label: item.titulo, href: '/#servicios' })),
    },
    {
      title: t.footer.columnas.empresa,
      links: [
        { label: t.header.nav.procesos, href: '/#procesos' },
        { label: t.header.nav.proceso, href: '/#proceso' },
        { label: t.header.nav.porque, href: '/#porque' },
        { label: t.footer.ejemplos, href: '/#ejemplos' },
        { label: t.header.nav.preguntas, href: '/#preguntas' },
      ],
    },
    {
      title: t.footer.columnas.contacto,
      links: [
        {
          label: 'WhatsApp',
          href: whatsappLink(locale),
          external: true,
          ariaLabel: `WhatsApp ${newTabNotice(locale)}`,
        },
        { label: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
        { label: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
      ],
    },
    {
      title: t.footer.columnas.legal,
      links: [{ label: t.footer.privacidad, href: '/privacidad' }],
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

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="flex flex-col gap-2.5 text-[0.9375rem]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href} className={LINK_CLASS}>
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        aria-label={link.ariaLabel}
                        className={LINK_CLASS}
                      >
                        {link.label}
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
