'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';
import { TECHNOLOGIES } from '../data/technologies';

interface TechTickerProps {
  label: string;
  pauseLabel: string;
  resumeLabel: string;
}

const LOOP_SECONDS = 28;

// Logos fade at the edges instead of being cut off.
const EDGE_MASK = 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)';

// The track holds the list twice and moves -50%, so the loop has no jump. It uses the Web
// Animations API instead of a globals.css animation so it does not depend on stylesheet
// order or a stale browser cache. Paused on hover, focus or the button (WCAG 2.2.2). With
// reduced motion no animation is created and logos wrap into rows without duplicates.
export function TechTicker({ label, pauseLabel, resumeLabel }: TechTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [pausedByButton, setPausedByButton] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion || typeof track.animate !== 'function') return;
    const animation = track.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      { duration: LOOP_SECONDS * 1000, iterations: Infinity, easing: 'linear' },
    );
    animationRef.current = animation;
    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;
    if (pausedByButton || hovered) animation.pause();
    else animation.play();
  }, [pausedByButton, hovered, reducedMotion]);

  const list = (isCopy: boolean) => (
    <ul
      className={`flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 ${reducedMotion ? 'flex-wrap gap-y-6' : ''}`}
      aria-hidden={isCopy || undefined}
      aria-label={isCopy ? undefined : label}
    >
      {TECHNOLOGIES.map((tech) => (
        <li key={tech.name} className="shrink-0">
          <svg
            role="img"
            viewBox="0 0 24 24"
            fillRule={tech.evenodd ? 'evenodd' : undefined}
            className="size-8 fill-current text-hueso opacity-90 transition-opacity duration-150 hover:opacity-100 sm:size-9"
          >
            <title>{tech.name}</title>
            {tech.paths.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{label}</p>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPausedByButton((p) => !p)}
            aria-pressed={pausedByButton}
            className="cursor-pointer rounded-full border border-[var(--regla-noche)] px-3 py-1.5 font-mono text-xs text-hueso-medio transition-colors duration-150 hover:border-hueso-medio hover:text-hueso"
          >
            {pausedByButton ? resumeLabel : pauseLabel}
          </button>
        )}
      </div>

      <div
        data-cinta=""
        className="overflow-hidden"
        style={reducedMotion ? undefined : { WebkitMaskImage: EDGE_MASK, maskImage: EDGE_MASK }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div ref={trackRef} className={`flex ${reducedMotion ? '' : 'w-max'}`}>
          {list(false)}
          {!reducedMotion && list(true)}
        </div>
      </div>
    </div>
  );
}
