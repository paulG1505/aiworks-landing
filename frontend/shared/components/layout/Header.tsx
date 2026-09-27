'use client';

import { Menu, X } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { useUIStore } from '@/shared/store/useUIStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

export function Header() {
  // Optimize Zustand subscriptions (rerender-defer-reads)
  // Use selective subscriptions to avoid unnecessary re-renders
  const isMenuOpen = useUIStore((state) => state.isMenuOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);
  const { t, locale } = useTranslation();

  const navLinks = [
    { label: t.header.nav.procesos, href: '#procesos' },
    { label: t.header.nav.proceso, href: '#proceso' },
    { label: t.header.nav.porque, href: '#porque' },
    { label: t.header.nav.preguntas, href: '#preguntas' },
    { label: t.header.nav.contacto, href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    closeMenu();
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // El export estático no tiene backend donde recibir envíos de formulario,
  // así que el CTA del header lleva directo a WhatsApp, igual que el CTA final.
  const whatsappUrl = enlaceWhatsApp(locale);
  const whatsappAriaLabel = `${t.header.cta} ${avisoPestanaNueva(locale)}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--papel)] border-b border-[var(--regla)]">
      <Container>
        <nav className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="text-[length:var(--paso-1)] font-semibold text-[var(--tinta)]">
              {t.header.logo}
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-[var(--tinta-media)] hover:text-[var(--tinta)] transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language Selector & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSelector />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsappAriaLabel}
                className="accion accion-whatsapp"
              >
                {t.header.cta}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-[var(--tinta)] p-2 hover:bg-[var(--papel-hundido)] rounded-lg transition-colors duration-150"
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {/*
            Accesibilidad: cuando el menú está cerrado se saca del árbol con
            `hidden` (no max-h/overflow), así no queda alcanzable con Tab ni
            legible para un lector de pantalla. Por eso no se anima el
            despliegue: display:none no es animable y un truco de altura
            reintroduciría el problema que `hidden` resuelve (ver
            features/preguntas/components/Pregunta.tsx, mismo criterio).
          */}
          <div id="menu-movil" hidden={!isMenuOpen} className="lg:hidden mt-6">
            <ul className="flex flex-col gap-4 pb-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="block text-[var(--tinta-media)] hover:text-[var(--tinta)] transition-colors duration-150 py-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-[var(--regla)]">
                <LanguageSelector />
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={whatsappAriaLabel}
                  className="accion accion-whatsapp w-full"
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
