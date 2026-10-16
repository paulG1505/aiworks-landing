interface Props {
  label: string;
  suggestions: readonly string[];
  disabled: boolean;
  onPick: (text: string) => void;
}

export function SuggestionChips({ label, suggestions, disabled, onPick }: Props) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2 pl-[2.625rem]">
      {suggestions.map((suggestion) => (
        <li key={suggestion}>
          <button
            type="button"
            onClick={() => onPick(suggestion)}
            disabled={disabled}
            className="min-h-11 cursor-pointer rounded-full border border-[var(--regla-arena)] px-4 py-2 text-left text-[0.9375rem] leading-snug text-tinta transition-colors duration-150 hover:border-marca hover:text-marca disabled:cursor-default disabled:opacity-60"
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  );
}
