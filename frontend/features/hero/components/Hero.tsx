import { Container } from '@/shared/components/ui/Container';
import { AnimatedSection } from '@/shared/components/ui/AnimatedSection';
import { HeroContent } from './HeroContent';
import { IndustryBadges } from './IndustryBadges';
import { HeroVideoBackground } from './HeroVideoBackground';

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Video Background - covers entire section */}
      <HeroVideoBackground />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none z-[1]" />

      {/* Gradient effects for depth */}
      <div className="absolute inset-0 bg-[var(--gradient-radial)] opacity-20 pointer-events-none z-[2]" />

      {/* Content overlay - centered vertically */}
      <Container className="relative z-10 w-full py-32">
        <div className="flex flex-col items-center justify-center text-center space-y-16 min-h-[70vh]">
          {/* Main Content */}
          <AnimatedSection animation="fade-up" delay={0}>
            <HeroContent />
          </AnimatedSection>

          {/* Industry Badges */}
          <AnimatedSection animation="fade-up" delay={200}>
            <IndustryBadges />
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
