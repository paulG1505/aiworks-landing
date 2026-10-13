'use client';

import { useReveal } from '@/shared/hooks/useReveal';
import { cn } from '@/shared/lib/utils';

interface SectionHeadingProps {
  number: string;
  eyebrow: string;
  title: { before: string; highlight: string };
  intro?: string;
  introClassName?: string;
  className?: string;
}

export function SectionHeading({ number, eyebrow, title, intro, introClassName, className }: SectionHeadingProps) {
  const reveal = useReveal();

  return (
    <div
      {...reveal}
      className={cn(
        intro && 'lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16',
        className,
      )}
    >
      <div className="flex max-w-[900px] flex-col gap-5">
        <p className="eyebrow reveal">
          <span>
            <span className="tabular">{number}</span> — {eyebrow}
          </span>
        </p>
        <h2 className="heading">
          <span className="line-mask reveal-mask">
            <span className="line" style={{ '--d': '100ms' } as React.CSSProperties}>
              {title.before}
            </span>
          </span>
          <span className="line-mask reveal-mask">
            <span className="line highlight" style={{ '--d': '210ms' } as React.CSSProperties}>
              {title.highlight}
            </span>
          </span>
        </h2>
      </div>

      {intro && (
        <p
          className={cn('measure reveal mt-8 lg:mt-0 lg:pb-2', introClassName ?? 'text-tinta-media')}
          style={{ '--d': '320ms' } as React.CSSProperties}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
