interface PhaseProps {
  reached: boolean;
  phaseLabel: string;
  number: string;
  title: string;
  description: string;
  deliverable: string;
  deliverableLabel: string;
}

export function Phase({ reached, phaseLabel, number, title, description, deliverable, deliverableLabel }: PhaseProps) {
  return (
    <li className="phase flex flex-col gap-3.5" data-reached={reached ? '' : undefined}>
      <span className="font-mono text-[0.8125rem] font-medium text-hueso-medio">
        {phaseLabel} <span className="tabular">{number}</span>
      </span>
      <h3 className="text-[1.5rem] leading-[1.15] lg:text-[1.875rem] lg:leading-[1.05]">{title}</h3>
      <p className="text-[var(--hueso-tenue)]">{description}</p>
      <p className="mt-1 flex flex-col gap-1 text-base text-hueso-medio">
        <span className="font-mono text-[0.8125rem] uppercase tracking-[0.12em]">{deliverableLabel}</span>
        <span>{deliverable}</span>
      </p>
    </li>
  );
}
