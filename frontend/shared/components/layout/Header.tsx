'use client';

import { Menu, X } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { useUIStore } from '@/shared/store/useUIStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

export function Header() {
  // Suscripciones selectivas a Zustand para no re-renderizar de más.
  const isMenuOpen = useUIStore((state) => state.isMenuOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);
  const { t, locale } = useTranslation();

  const navLinks = [
    { label: t.header.nav.servicios, href: '#servicios' },
    { label: t.header.nav.procesos, href: '#procesos' },
    { label: t.header.nav.proceso, href: '#proceso' },
    { label: t.header.nav.porque, href: '#porque' },
    { label: t.header.nav.preguntas, href: '#preguntas' },
  ];

  const handleNavClick = (href: string) => {
    closeMenu();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  // El export estático no tiene backend: el CTA del header lleva directo a WhatsApp.
  const whatsappUrl = enlaceWhatsApp(locale);
  const whatsappAriaLabel = `${t.header.cta} ${avisoPestanaNueva(locale)}`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-regla bg-papel">
      <Container>
        <nav aria-label={locale === 'en' ? 'Main' : 'Principal'} className="py-3.5 lg:py-[18px]">
          <div className="flex items-center justify-between gap-4">
            {/* Wordmark tipográfico: placeholder hasta que exista un logo. */}
            <a href="#" className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-tinta lg:text-[1.25rem]">
              {t.header.logo}
            </a>

            <div className="flex items-center gap-7">
              <ul className="hidden items-center gap-7 text-[0.9375rem] lg:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="text-tinta transition-colors duration-150 hover:text-marca"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 lg:gap-7">
                <LanguageSelector />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={whatsappAriaLabel}
                  className="accion accion-contorno hidden lg:inline-flex"
                >
                  {t.header.cta}
                </a>

                <button
                  type="button"
                  onClick={toggleMenu}
                  className="-mr-2 cursor-pointer rounded-full p-2 text-tinta transition-colors duration-150 hover:bg-arena lg:hidden"
                  aria-expanded={isMenuOpen}
                  aria-controls="menu-movil"
                  aria-label={
                    locale === 'en'
                      ? isMenuOpen ? 'Close menu' : 'Open menu'
                      : isMenuOpen ? 'Cerrar menú' : 'Abrir menú'
                  }
                >
                  {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
              </div>
            </div>
          </div>

          {/*
            Accesibilidad: cerrado, el menú sale del árbol con `hidden`, así no queda
            alcanzable con Tab ni legible para un lector de pantalla.
          */}
          <div id="menu-movil" hidden={!isMenuOpen} className="lg:hidden">
            <ul className="mt-4 flex flex-col border-t border-regla pb-2 pt-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="block py-3 font-titular text-2xl font-semibold tracking-[-0.02em] text-tinta"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={whatsappAriaLabel}
                  className="accion accion-primaria w-full"
                >
                  {t.header.cta}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
}
