'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Ejemplo {
  area: string;
  titulo: string;
  hoy: string;
  conIa: string;
}

interface CarruselEjemplosProps {
  titulo: string;
  anterior: string;
  siguiente: string;
  hoyLabel: string;
  conIaLabel: string;
  items: readonly Ejemplo[];
}

/**
 * Carrusel de ejemplos de automatización. Es scroll nativo con scroll-snap: se mueve con
 * swipe, trackpad, rueda o flechas del teclado (la pista es enfocable) sin JS de
 * arrastre. Los botones avanzan una tarjeta y se desactivan en los extremos; el
 * contador dice cuántas se ven de cuántas hay.
 *
 * Tarjetas visibles: 1,15 en móvil (se asoma la siguiente para invitar al swipe),
 * 2 en tablet y 3 en escritorio.
 */
export function CarruselEjemplos({ titulo, anterior, siguiente, hoyLabel, conIaLabel, items }: CarruselEjemplosProps) {
  const pistaRef = useRef<HTMLUListElement>(null);
  const [estado, setEstado] = useState({ inicio: true, fin: false, primera: 1, ultima: 1 });

  const medir = useCallback(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const { scrollLeft, clientWidth, scrollWidth } = pista;
    const tarjetas = Array.from(pista.children) as HTMLElement[];
    const visibles = tarjetas
      .map((el, i) => ({ i, izq: el.offsetLeft - pista.offsetLeft, ancho: el.offsetWidth }))
      .filter(({ izq, ancho }) => izq + ancho / 2 >= scrollLeft && izq + ancho / 2 <= scrollLeft + clientWidth);
    setEstado({
      inicio: scrollLeft <= 4,
      fin: scrollLeft + clientWidth >= scrollWidth - 4,
      primera: (visibles[0]?.i ?? 0) + 1,
      ultima: (visibles[visibles.length - 1]?.i ?? 0) + 1,
    });
  }, []);

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    let frame = 0;
    const alMover = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; medir(); });
    };
    alMover();
    pista.addEventListener('scroll', alMover, { passive: true });
    window.addEventListener('resize', alMover);
    return () => {
      pista.removeEventListener('scroll', alMover);
      window.removeEventListener('resize', alMover);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [medir]);

  const mover = (direccion: 1 | -1) => {
    const pista = pistaRef.current;
    const tarjeta = pista?.firstElementChild as HTMLElement | null;
    if (!pista || !tarjeta) return;
    const paso = tarjeta.offsetWidth + parseFloat(getComputedStyle(pista).columnGap || '0');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pista.scrollBy({ left: direccion * paso, behavior: reducido ? 'auto' : 'smooth' });
  };

  const rango = estado.primera === estado.ultima ? `${estado.primera}` : `${estado.primera}–${estado.ultima}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-6">
        <h3 className="text-[1.75rem] leading-[1.1] lg:text-[2.25rem]">{titulo}</h3>

        <div className="flex shrink-0 items-center gap-3">
          <span className="tabular hidden text-sm text-tinta-media sm:inline" aria-live="polite">
            {rango} / {items.length}
          </span>
          {([
            [-1, anterior, ArrowLeft, estado.inicio],
            [1, siguiente, ArrowRight, estado.fin],
          ] as const).map(([dir, etiqueta, Icono, desactivado]) => (
            <button
              key={dir}
              type="button"
              onClick={() => mover(dir)}
              disabled={desactivado}
              aria-label={etiqueta}
              aria-controls="carrusel-ejemplos"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-tinta text-tinta transition-colors duration-150 hover:bg-tinta hover:text-papel disabled:cursor-default disabled:border-regla disabled:text-regla disabled:hover:bg-transparent"
            >
              <Icono className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={pistaRef}
        id="carrusel-ejemplos"
        tabIndex={0}
        aria-label={titulo}
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
            <h4 className="font-serif text-[1.625rem] leading-[1.15] lg:text-[1.875rem]">{item.titulo}</h4>
            <dl className="mt-auto grid grid-cols-1 gap-y-1 text-base leading-normal sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-3">
              <dt className="font-mono text-xs font-medium uppercase leading-[2] text-tinta-media">{hoyLabel}</dt>
              <dd className="mb-3 text-tinta-media sm:mb-0">{item.hoy}</dd>
              <dt className="font-mono text-xs font-medium uppercase leading-[2] text-marca">{conIaLabel}</dt>
              <dd>{item.conIa}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
