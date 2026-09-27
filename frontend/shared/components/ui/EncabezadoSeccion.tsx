'use client';

import { useRevelado } from '@/shared/hooks/useRevelado';
import { cn } from '@/shared/lib/utils';

interface EncabezadoSeccionProps {
  numero: string;
  eyebrow: string;
  titulo: { antes: string; clave: string };
  /** Párrafo de entrada. En escritorio va en una segunda columna, a la derecha del titular. */
  intro?: string;
  introClassName?: string;
  className?: string;
}

/**
 * Patrón de cada bloque: eyebrow numerado y titular en dos líneas, la segunda en
 * cursiva con el acento. Al revelarse, el eyebrow aparece primero y cada línea sube
 * desde su máscara con 110ms de diferencia.
 *
 * Con `intro`, desde lg el encabezado se parte en dos columnas —titular a la izquierda,
 * párrafo a la derecha alineado abajo— para que las pantallas anchas no queden vacías a
 * la derecha. En móvil y tablet todo sigue en una columna.
 */
export function EncabezadoSeccion({ numero, eyebrow, titulo, intro, introClassName, className }: EncabezadoSeccionProps) {
  const revelado = useRevelado();

  return (
    <div
      {...revelado}
      className={cn(
        intro && 'lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16',
        className,
      )}
    >
      <div className="flex max-w-[900px] flex-col gap-5">
        <p className="eyebrow revelar">
          <span>
            <span className="tabular">{numero}</span> — {eyebrow}
          </span>
        </p>
        <h2 className="titular">
          <span className="linea-mascara revelar-mascara">
            <span className="linea" style={{ '--d': '100ms' } as React.CSSProperties}>
              {titulo.antes}
            </span>
          </span>
          <span className="linea-mascara revelar-mascara">
            <span className="linea clave" style={{ '--d': '210ms' } as React.CSSProperties}>
              {titulo.clave}
            </span>
          </span>
        </h2>
      </div>

      {intro && (
        <p
          className={cn('medida revelar mt-8 lg:mt-0 lg:pb-2', introClassName ?? 'text-tinta-media')}
          style={{ '--d': '320ms' } as React.CSSProperties}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
