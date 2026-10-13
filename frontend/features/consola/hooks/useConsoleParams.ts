'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSOLE_PATH } from '@/shared/constants/site';
import { CONVERSATION_ID } from '../api/client';
import { currentMonth, lastTwelveMonths } from '../lib/month';
import type { Channel, MonthKey } from '../types';

export interface ConsoleParams {
  month: MonthKey;
  tenantId: string | undefined;
  channel: Channel | undefined;
  readyOnly: boolean;
  conversationId: string | undefined;
}

export type ConsoleParamsPatch = Partial<ConsoleParams>;

export function useConsoleParams(tenantIds: readonly string[] = []) {
  const router = useRouter();
  const search = useSearchParams().toString();
  const tenantKey = tenantIds.join('\n');

  const params = useMemo<ConsoleParams>(() => {
    const query = new URLSearchParams(search);
    const month = query.get('mes') ?? '';
    const tenant = query.get('tenant') ?? '';
    const channel = query.get('canal');
    const conversation = query.get('c') ?? '';
    return {
      month: lastTwelveMonths().includes(month) ? month : currentMonth(),
      tenantId: tenantKey.split('\n').includes(tenant) && tenant ? tenant : undefined,
      channel: channel === 'web' || channel === 'whatsapp' ? channel : undefined,
      readyOnly: query.get('listas') === '1',
      conversationId: CONVERSATION_ID.test(conversation) ? conversation : undefined,
    };
  }, [search, tenantKey]);

  const update = useCallback(
    (patch: ConsoleParamsPatch) => {
      const next = { ...params, ...patch };
      const query = new URLSearchParams();
      if (next.month !== currentMonth()) query.set('mes', next.month);
      if (next.tenantId) query.set('tenant', next.tenantId);
      if (next.channel) query.set('canal', next.channel);
      if (next.readyOnly) query.set('listas', '1');
      if (next.conversationId) query.set('c', next.conversationId);
      const text = query.toString();
      router.replace(text ? `${CONSOLE_PATH}?${text}` : CONSOLE_PATH, { scroll: false });
    },
    [params, router],
  );

  return { params, update };
}
