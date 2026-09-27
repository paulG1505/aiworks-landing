interface FaseProps {
  alcanzada: boolean;
  faseLabel: string;
  numero: string;
  titulo: string;
  descripcion: string;
  entregable: string;
  entregableLabel: string;
}

export function Fase({ alcanzada, faseLabel, numero, titulo, descripcion, entregable, entregableLabel }: FaseProps) {
  return (
    <li className="fase flex flex-col gap-3.5" data-alcanzada={alcanzada ? '' : undefined}>
      <span className="font-mono text-xs font-medium text-hueso-medio">
        {faseLabel} <span className="tabular">{numero}</span>
      </span>
      <h3 className="text-[1.75rem] leading-[1.1] lg:text-[2.125rem] lg:leading-[1.05]">{titulo}</h3>
      <p className="text-base text-[var(--hueso-tenue)]">{descripcion}</p>
      <p className="mt-1 flex flex-col gap-1 text-[0.9375rem] text-hueso-medio">
        <span className="font-mono text-xs uppercase tracking-[0.12em]">{entregableLabel}</span>
        <span>{entregable}</span>
      </p>
    </li>
  );
}
