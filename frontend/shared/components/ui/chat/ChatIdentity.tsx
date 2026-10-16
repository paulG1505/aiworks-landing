interface Props {
  name: string;
  statusLabel: string;
  nameId?: string;
}

export function ChatIdentity({ name, statusLabel, nameId }: Props) {
  const initial = name.trim().charAt(0).toLocaleUpperCase() || '?';
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-marca font-display text-[1.25rem] font-semibold leading-none text-papel"
      >
        {initial}
      </span>
      <div className="min-w-0">
        <p id={nameId} className="truncate font-display text-[1.125rem] font-semibold leading-tight text-tinta">
          {name}
        </p>
        <p className="mt-0.5 flex items-center gap-2 text-[0.8125rem] leading-tight text-tinta-media">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-marca" />
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
