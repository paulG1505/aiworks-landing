'use client';

import { Button } from '@/shared/components/ui/Button';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function HeroContent() {
  const { t } = useTranslation();

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl space-y-10">
      {/* Headline - Optimized for SEO with text-shadow for better readability */}
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}
      >
        {t.hero.headline}
      </h1>

      {/* Subtitle - Enhanced contrast */}
      <p
        className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto"
        style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}
      >
        {t.hero.subtitle}
      </p>

      {/* CTAs - Enhanced with better contrast */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={() => handleNavClick('#contacto')}
          className="shadow-[0_8px_30px_rgba(0,102,255,0.4)] hover:shadow-[0_8px_40px_rgba(0,102,255,0.6)] transition-shadow"
        >
          {t.hero.cta.primary}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleNavClick('#servicios')}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-lg"
        >
          {t.hero.cta.secondary}
        </Button>
      </div>
    </div>
  );
}
