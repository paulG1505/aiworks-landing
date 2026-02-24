'use client';

import { Container } from '@/shared/components/ui/Container';
import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { ContactForm } from './ContactForm';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function CTAFinal() {
  const { t } = useTranslation();

  return (
    <section id="contacto" className="py-20 lg:py-32 bg-[var(--white-5)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Side - 60% (3 columns) */}
          <AnimatedSection animation="slide-left" delay={0} className="lg:col-span-3">
            <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-xl text-gray-400 leading-relaxed">
              {t.cta.description}
            </p>
          </div>
          </AnimatedSection>

          {/* Right Side - 40% (2 columns) */}
          <AnimatedSection animation="slide-right" delay={200} className="lg:col-span-2">
            <ContactForm />
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
