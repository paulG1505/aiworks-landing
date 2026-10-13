import { copy } from '../copy';

interface ConsoleHeaderProps {
  user: string;
  onSignOut: () => void;
}

export function ConsoleHeader({ user, onSignOut }: ConsoleHeaderProps) {
  return (
    <header className="flex items-baseline justify-between gap-4 border-b border-regla px-4 py-3 lg:px-8">
      <h1 className="font-display text-xl">{copy.title}</h1>
      <div className="flex items-baseline gap-5">
        <span className="tabular text-xs text-tinta-media">{user}</span>
        <button type="button" onClick={onSignOut} className="link cursor-pointer text-sm">
          {copy.signOut}
        </button>
      </div>
    </header>
  );
}
