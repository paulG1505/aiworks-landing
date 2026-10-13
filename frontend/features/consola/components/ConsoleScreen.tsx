'use client';

import { useRef } from 'react';
import { copy } from '../copy';
import { useConsoleParams } from '../hooks/useConsoleParams';
import { useInboxKeyboard } from '../hooks/useInboxKeyboard';
import { useIsDesktop } from '../hooks/useIsDesktop';
import type { SessionInfo } from '../types';
import { ConsoleHeader } from './ConsoleHeader';
import { Inbox, type InboxHandle } from './Inbox';
import { MonthSummary } from './MonthSummary';

interface ConsoleScreenProps {
  session: SessionInfo;
  onSignOut: () => void;
}

export function ConsoleScreen({ session, onSignOut }: ConsoleScreenProps) {
  const { params, update } = useConsoleParams(session.tenants.map((tenant) => tenant.id));
  const isDesktop = useIsDesktop();
  const summaryHeading = useRef<HTMLHeadingElement>(null);
  const inbox = useRef<InboxHandle>(null);

  const onKeyDown = useInboxKeyboard({
    isDesktop,
    selectRow: (id) => update({ conversationId: id }),
    focusSummary: () => summaryHeading.current?.focus(),
  });

  return (
    <div onKeyDown={onKeyDown} className="flex h-dvh flex-col bg-papel text-tinta">
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
        <Inbox
          ref={inbox}
          month={params.month}
          tenantId={params.tenantId}
          channel={params.channel}
          readyOnly={params.readyOnly}
          tenants={session.tenants}
          selectedId={params.conversationId}
          onSelect={(id) => update({ conversationId: id })}
          onFiltersChange={(patch) => update(patch)}
        />
        <section aria-label={copy.reader.label} className="flex-1" />
      </div>
    </div>
  );
}
