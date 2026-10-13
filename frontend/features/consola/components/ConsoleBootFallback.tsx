import { copy } from '../copy';

export function ConsoleBootFallback() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <p role="status" className="tabular text-sm text-tinta-media">
        {copy.boot}
      </p>
    </div>
  );
}
