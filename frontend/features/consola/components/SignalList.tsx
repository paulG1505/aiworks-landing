import { copy } from '../copy';
import type { Signal } from '../types';

export function SignalList({ signals }: { signals: Signal[] }) {
  return (
    <section aria-labelledby="console-signals-heading" className="mt-8 border-t border-regla pt-4">
      <h3 id="console-signals-heading" className="eyebrow">
        {copy.reader.signals}
      </h3>
      <ul className="mt-2">
        {signals.map((signal) => (
          <li key={signal.key} className="flex items-baseline justify-between gap-4 border-b border-regla py-2">
            <span>{signal.label}</span>
            <span className={`tabular text-xs ${signal.reached ? 'text-marca' : 'text-tinta-media'}`}>
              {signal.reached ? copy.reader.reached : copy.reader.pending}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
