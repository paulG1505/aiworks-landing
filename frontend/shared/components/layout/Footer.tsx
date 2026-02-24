'use client';

import { GradientText } from '@/shared/components/ui/GradientText';
import { CONTACT_INFO } from '@/shared/constants';
import { Linkedin, Github, Twitter } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  const navigationLinks = [
    { label: t.footer.navigation.services, href: '#servicios' },
    { label: t.footer.navigation.technologies, href: '#tecnologias' },
    { label: t.footer.navigation.about, href: '#nosotros' },
    { label: t.footer.navigation.contact, href: '#contacto' },
  ];

  const legalLinks = [
    { label: t.footer.legal.privacy, href: '#' },
    { label: t.footer.legal.terms, href: '#' },
  ];

  return (
    <footer className="relative bg-[var(--bg-dark)] text-white pt-20 pb-8">
      {/* Decorative gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[200px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--primary-blue) 0%, transparent 70%)'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Branding Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <GradientText>{t.footer.brand.name}</GradientText>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.brand.description}
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.navigation.title}</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--primary-cyan)] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.legal.title}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--primary-cyan)] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#222222]" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-gray-400 text-sm">
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-3">
            {CONTACT_INFO.socials.linkedin && (
              <a
                href={CONTACT_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--white-10)] hover:bg-[var(--primary-blue)] flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {CONTACT_INFO.socials.twitter && (
              <a
                href={CONTACT_INFO.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--white-10)] hover:bg-[var(--primary-blue)] flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {CONTACT_INFO.socials.github && (
              <a
                href={CONTACT_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[var(--white-10)] hover:bg-[var(--primary-blue)] flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
