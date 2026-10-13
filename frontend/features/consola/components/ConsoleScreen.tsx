'use client';

import { useRef } from 'react';
import { copy } from '../copy';
import { useConsoleParams } from '../hooks/useConsoleParams';
import type { SessionInfo } from '../types';
import { ConsoleHeader } from './ConsoleHeader';
import { MonthSummary } from './MonthSummary';

interface ConsoleScreenProps {
  session: SessionInfo;
  onSignOut: () => void;
}

export function ConsoleScreen({ session, onSignOut }: ConsoleScreenProps) {
  const { params, update } = useConsoleParams(session.tenants.map((tenant) => tenant.id));
  const summaryHeading = useRef<HTMLHeadingElement>(null);

  return (
    <div className="flex h-dvh flex-col bg-papel text-tinta">
      <ConsoleHeader user={session.user} onSignOut={onSignOut} />
      <MonthSummary
        month={params.month}
        tenantId={params.tenantId}
        channel={params.channel}
        tenants={session.tenants}
        headingRef={summaryHeading}
        onMonthChange={(month) => update({ month })}
      />
      <div className="flex min-h-0 flex-1">
        <section aria-label={copy.inbox.label} className="w-[38%] border-r border-regla" />
        <section aria-label={copy.reader.label} className="flex-1" />
      </div>
    </div>
  );
}
