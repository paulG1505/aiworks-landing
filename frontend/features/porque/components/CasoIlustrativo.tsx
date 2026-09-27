interface CasoIlustrativoProps {
  indice: number;
  rotulo: string;
  titulo: string;
  hoyLabel: string;
  hoy: string;
  conIaLabel: string;
  conIa: string;
}

type Retardo = React.CSSProperties & { '--d': string };

/**
 * Caso ilustrativo, rotulado con el mismo borde punteado que el registro operativo. El
 * rótulo aparece 200ms antes que el contenido: se lee "ilustrativo" antes que el caso.
 */
export function CasoIlustrativo({ indice, rotulo, titulo, hoyLabel, hoy, conIaLabel, conIa }: CasoIlustrativoProps) {
  const base = indice * 90;

  return (
    <li className="flex flex-col gap-4 rounded-[10px] bg-arena p-6 sm:p-8">
      <span className="rotulo-ilustrativo revelar" style={{ '--d': `${base}ms` } as Retardo}>
        {rotulo}
      </span>
      <div className="revelar flex flex-col gap-4" style={{ '--d': `${base + 200}ms` } as Retardo}>
        <h3 className="text-[1.5rem] leading-[1.15] lg:text-[1.75rem]">{titulo}</h3>
        <dl className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[0.875rem] leading-normal sm:grid-cols-[72px_minmax(0,1fr)]">
          <dt className="font-mono text-[0.6875rem] font-medium uppercase leading-[1.8] text-tinta-media">{hoyLabel}</dt>
          <dd>{hoy}</dd>
          <dt className="font-mono text-[0.6875rem] font-medium uppercase leading-[1.8] text-tinta-media">{conIaLabel}</dt>
          <dd>{conIa}</dd>
        </dl>
      </div>
    </li>
  );
}
