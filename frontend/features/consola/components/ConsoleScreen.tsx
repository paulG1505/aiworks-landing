'use client';

import { copy } from '../copy';
import { useConsoleParams } from '../hooks/useConsoleParams';
import { formatMonth } from '../lib/format';
import type { SessionInfo } from '../types';
import { ConsoleHeader } from './ConsoleHeader';

interface ConsoleScreenProps {
  session: SessionInfo;
  onSignOut: () => void;
}

export function ConsoleScreen({ session, onSignOut }: ConsoleScreenProps) {
  const { params } = useConsoleParams(session.tenants.map((tenant) => tenant.id));

  return (
    <div className="flex h-dvh flex-col bg-papel text-tinta">
      <ConsoleHeader user={session.user} onSignOut={onSignOut} />
      <section aria-labelledby="console-summary-heading" className="border-b border-regla px-4 py-4 lg:px-8">
        <h2 id="console-summary-heading" tabIndex={-1} className="font-display text-xl">
          {copy.summary.heading(formatMonth(params.month))}
        </h2>
      </section>
      <div className="flex min-h-0 flex-1">
        <section aria-label={copy.inbox.label} className="w-[38%] border-r border-regla" />
        <section aria-label={copy.reader.label} className="flex-1" />
      </div>
    </div>
  );
}
