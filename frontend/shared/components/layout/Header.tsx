'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { ThemeToggle } from '@/shared/components/layout/ThemeToggle';
import { ProgressBar } from '@/shared/components/layout/ProgressBar';
import { useUIStore } from '@/shared/store/useUIStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { whatsappLink, newTabNotice } from '@/shared/lib/whatsapp';

const PANEL = {
  closed: { height: 0, opacity: 0 },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], when: 'beforeChildren', staggerChildren: 0.04 },
  },
} as const;
const ITEM = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
} as const;

export function Header() {
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

  // With the mobile menu open, scrolling waits for its exit animation: Chrome cancels a
  // smooth scroll that starts while the menu is unmounting.
  const pendingTarget = useRef<HTMLElement | null>(null);
  const scrollTo = (target: HTMLElement) => target.scrollIntoView({ behavior: 'smooth' });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.getElementById(href.split('#')[1] ?? '');
    if (!target) {
      closeMenu();
      return;
    }
    e.preventDefault();
    if (isMenuOpen) {
      pendingTarget.current = target;
      closeMenu();
    } else {
      scrollTo(target);
    }
  };

  const onMenuExitComplete = () => {
    if (pendingTarget.current) scrollTo(pendingTarget.current);
    pendingTarget.current = null;
  };

  const whatsappUrl = whatsappLink(locale);
  const whatsappAriaLabel = `${t.header.cta} ${newTabNotice(locale)}`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-regla bg-papel">
      <Container>
        <nav aria-label={locale === 'en' ? 'Main' : 'Principal'} className="py-3.5 lg:py-[18px]">
          <div className="flex items-center justify-between gap-4">
            {/* Typographic wordmark: placeholder until a logo exists. */}
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
                <ThemeToggle />
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

          {/* Closed, the menu is unmounted so it is unreachable by Tab and screen readers. */}
          <AnimatePresence initial={false} onExitComplete={onMenuExitComplete}>
            {isMenuOpen && (
              <m.div
                id="menu-movil"
                className="overflow-hidden lg:hidden"
                variants={PANEL}
                initial="closed"
                animate="open"
                exit="closed"
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
      <ProgressBar />
    </header>
  );
}
