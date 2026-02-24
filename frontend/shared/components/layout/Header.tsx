'use client';

import { Menu, X } from 'lucide-react';
import { GradientText } from '@/shared/components/ui/GradientText';
import { Button } from '@/shared/components/ui/Button';
import { LanguageSelector } from '@/shared/components/layout/LanguageSelector';
import { useUIStore } from '@/shared/store/useUIStore';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { cn } from '@/shared/lib/utils';

export function Header() {
  // Optimize Zustand subscriptions (rerender-defer-reads)
  // Use selective subscriptions to avoid unnecessary re-renders
  const isMenuOpen = useUIStore((state) => state.isMenuOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);
  const { t } = useTranslation();

  const navLinks = [
    { label: t.header.nav.services, href: '#servicios' },
    { label: t.header.nav.technologies, href: '#tecnologias' },
    { label: t.header.nav.about, href: '#nosotros' },
    { label: t.header.nav.process, href: '#proceso' },
    { label: t.header.nav.contact, href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    closeMenu();
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[10px] bg-[#0F0F2380] border-b border-[var(--white-10)]">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-[120px] py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-2xl font-bold">
            <GradientText>{t.header.logo}</GradientText>
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
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Language Selector & CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <Button
              size="md"
              onClick={() => handleNavClick('#contacto')}
            >
              {t.header.cta}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white p-2 hover:bg-[var(--white-10)] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            isMenuOpen ? 'max-h-[500px] mt-6' : 'max-h-0'
          )}
        >
          <ul className="flex flex-col gap-4 pb-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10">
              <LanguageSelector />
            </li>
            <li>
              <Button
                fullWidth
                size="md"
                onClick={() => handleNavClick('#contacto')}
              >
                {t.header.cta}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
