interface FaseProps {
  numero: string;
  titulo: string;
  descripcion: string;
  entregable: string;
  entregableLabel: string;
}

export function Fase({ numero, titulo, descripcion, entregable, entregableLabel }: FaseProps) {
  return (
    <div className="fila">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="tabular text-[var(--tinta-media)] text-[length:var(--paso--1)] sm:w-12 shrink-0">
          {numero}
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="text-[length:var(--paso-2)] text-[var(--tinta)]">{titulo}</h3>
          <p className="medida text-[var(--tinta)]">{descripcion}</p>
          <div className="border-l border-[var(--marca)] pl-4 space-y-1">
            <p className="text-[var(--tinta-media)] text-[length:var(--paso--1)]">{entregableLabel}</p>
            <p className="text-[var(--tinta)]">{entregable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
