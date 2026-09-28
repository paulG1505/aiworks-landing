'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { SelectorTema } from '@/shared/components/layout/SelectorTema';
import { BarraProgreso } from '@/shared/components/layout/BarraProgreso';
import { useUIStore } from '@/shared/store/useUIStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

// Menú móvil: el panel se despliega en altura y los enlaces entran uno tras otro.
const PANEL = {
  cerrado: { height: 0, opacity: 0 },
  abierto: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], when: 'beforeChildren', staggerChildren: 0.04 },
  },
} as const;
const ITEM = {
  cerrado: { opacity: 0, y: -8 },
  abierto: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
} as const;

export function Header() {
  // Suscripciones selectivas a Zustand para no re-renderizar de más.
  const isMenuOpen = useUIStore((state) => state.isMenuOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);
  const { t, locale } = useTranslation();

  const navLinks = [
    { label: t.header.nav.servicios, href: '/#servicios' },
    { label: t.header.nav.procesos, href: '/#procesos' },
    { label: t.header.nav.proceso, href: '/#proceso' },
    { label: t.header.nav.porque, href: '/#porque' },
    { label: t.header.nav.preguntas, href: '/#preguntas' },
  ];

  // Los enlaces apuntan a "/#seccion" para que también funcionen desde otras rutas
  // (p. ej. /privacidad). Si la sección está en esta página, se desplaza suave sin recargar.
  // Con el menú móvil abierto, el desplazamiento espera a que termine su animación de
  // salida: si arranca mientras el menú se desmonta, Chrome cancela el scroll suave.
  const destinoPendiente = useRef<HTMLElement | null>(null);
  const desplazarA = (destino: HTMLElement) => destino.scrollIntoView({ behavior: 'smooth' });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const destino = document.getElementById(href.split('#')[1] ?? '');
    if (!destino) {
      closeMenu();
      return;
    }
    e.preventDefault();
    if (isMenuOpen) {
      destinoPendiente.current = destino;
      closeMenu();
    } else {
      desplazarA(destino);
    }
  };

  const alCerrarMenu = () => {
    if (destinoPendiente.current) desplazarA(destinoPendiente.current);
    destinoPendiente.current = null;
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
            <Link
              href="/"
              className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-tinta lg:text-[1.25rem]"
            >
              {t.header.logo}
            </Link>

            <div className="flex items-center gap-7">
              <ul className="hidden items-center gap-7 text-[0.9375rem] lg:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="nav-enlace text-tinta transition-colors duration-150 hover:text-marca"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2.5 lg:gap-4">
                <LanguageSelector />
                <SelectorTema />
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
                      ? isMenuOpen
                        ? 'Close menu'
                        : 'Open menu'
                      : isMenuOpen
                        ? 'Cerrar menú'
                        : 'Abrir menú'
                  }
                >
                  {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
              </div>
            </div>
          </div>

          {/*
            Accesibilidad: cerrado, el menú se desmonta (AnimatePresence lo saca del DOM al
            terminar la salida), así no queda alcanzable con Tab ni legible para un lector
            de pantalla.
          */}
          <AnimatePresence initial={false} onExitComplete={alCerrarMenu}>
            {isMenuOpen && (
              <m.div
                id="menu-movil"
                className="overflow-hidden lg:hidden"
                variants={PANEL}
                initial="cerrado"
                animate="abierto"
                exit="cerrado"
              >
                <ul className="mt-4 flex flex-col border-t border-regla pb-2 pt-2">
                  {navLinks.map((link) => (
                    <m.li key={link.href} variants={ITEM}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="block py-3 font-titular text-2xl font-semibold tracking-[-0.02em] text-tinta"
                      >
                        {link.label}
                      </a>
                    </m.li>
                  ))}
                  <m.li variants={ITEM} className="pt-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={whatsappAriaLabel}
                      className="accion accion-primaria w-full"
                    >
                      {t.header.cta}
                    </a>
                  </m.li>
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        </nav>
      </Container>
      <BarraProgreso />
    </header>
  );
}
