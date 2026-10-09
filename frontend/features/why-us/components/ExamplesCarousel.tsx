'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Example {
  area: string;
  titulo: string;
  hoy: string;
  conIa: string;
}

interface ExamplesCarouselProps {
  title: string;
  previous: string;
  next: string;
  todayLabel: string;
  withAiLabel: string;
  items: readonly Example[];
}

// Native scroll with scroll-snap, so swipe, trackpad, wheel and arrow keys work without drag JS.
// Visible cards: 1.15 on mobile (the next one peeks in to invite a swipe), 2 on tablet, 3 on desktop.
export function ExamplesCarousel({ title, previous, next, todayLabel, withAiLabel, items }: ExamplesCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, first: 1, last: 1 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth, scrollWidth } = track;
    const cards = Array.from(track.children) as HTMLElement[];
    const visible = cards
      .map((el, i) => ({ i, left: el.offsetLeft - track.offsetLeft, width: el.offsetWidth }))
      .filter(({ left, width }) => left + width / 2 >= scrollLeft && left + width / 2 <= scrollLeft + clientWidth);
    setState({
      atStart: scrollLeft <= 4,
      atEnd: scrollLeft + clientWidth >= scrollWidth - 4,
      first: (visible[0]?.i ?? 0) + 1,
      last: (visible[visible.length - 1]?.i ?? 0) + 1,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onMove = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); });
    };
    onMove();
    track.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove);
    return () => {
      track.removeEventListener('scroll', onMove);
      window.removeEventListener('resize', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure]);

  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * step, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const range = state.first === state.last ? `${state.first}` : `${state.first}–${state.last}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h3 className="text-[1.625rem] leading-[1.1] lg:text-[2rem]">{title}</h3>

        <div className="flex shrink-0 items-center gap-3">
          <span className="tabular hidden text-sm text-tinta-media sm:inline" aria-live="polite">
            {range} / {items.length}
          </span>
          {([
            [-1, previous, ArrowLeft, state.atStart],
            [1, next, ArrowRight, state.atEnd],
          ] as const).map(([direction, label, Icon, disabled]) => (
            <button
              key={direction}
              type="button"
              onClick={() => move(direction)}
              disabled={disabled}
              aria-label={label}
              aria-controls="carrusel-ejemplos"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-tinta text-tinta transition-colors duration-150 hover:bg-tinta hover:text-papel disabled:cursor-default disabled:border-regla disabled:text-regla disabled:hover:bg-transparent"
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={trackRef}
        id="carrusel-ejemplos"
        tabIndex={0}
        aria-label={title}
        data-carrusel=""
        className="carrusel -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:gap-6 lg:scroll-px-0 lg:px-0"
      >
        {items.map((item, index) => (
          <li
            key={item.titulo}
            className="revelar tarjeta-ejemplo flex w-[85%] shrink-0 snap-start flex-col gap-5 rounded-[10px] bg-arena p-6 sm:w-[calc((100%-1rem)/2)] sm:p-8 lg:w-[calc((100%-3rem)/3)]"
            style={{ '--d': `${Math.min(index, 3) * 90}ms` } as React.CSSProperties}
          >
            <span className="flex items-center justify-between font-mono text-xs font-medium uppercase tracking-[0.12em] text-tinta-media">
              <span>{item.area}</span>
              <span className="tabular">{String(index + 1).padStart(2, '0')}</span>
            </span>
            <h4 className="font-titular text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.02em] lg:text-[1.5rem]">{item.titulo}</h4>
            <dl className="mt-auto grid grid-cols-1 gap-y-1 text-base leading-normal sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-3">
              <dt className="font-mono text-xs font-medium uppercase leading-[2] text-tinta-media">{todayLabel}</dt>
              <dd className="mb-3 text-tinta-media sm:mb-0">{item.hoy}</dd>
              <dt className="font-mono text-xs font-medium uppercase leading-[2] text-marca">{withAiLabel}</dt>
              <dd>{item.conIa}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
