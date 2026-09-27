'use client';

import { useRevelado } from '@/shared/hooks/useRevelado';
import { cn } from '@/shared/lib/utils';

interface EncabezadoSeccionProps {
  numero: string;
  eyebrow: string;
  titulo: { antes: string; clave: string };
  className?: string;
}

/**
 * Patrón de cada bloque: eyebrow numerado y titular en dos líneas, la segunda en
 * cursiva con el acento. Al revelarse, el eyebrow aparece primero y cada línea sube
 * desde su máscara con 110ms de diferencia.
 */
export function EncabezadoSeccion({ numero, eyebrow, titulo, className }: EncabezadoSeccionProps) {
  const revelado = useRevelado();

  return (
    <div {...revelado} className={cn('flex max-w-[900px] flex-col gap-5', className)}>
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
  );
}
