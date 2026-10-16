export type EndedKind = 'limit' | 'resting' | 'expired';

const RESTING = /descansando|\bresting\b/i;
const EXPIRED = /esta demo ya no est[aá] disponible|this demo is no longer available/i;
export const LOW_REMAINING_THRESHOLD = 4;

const KIND_BY_STATE: Record<string, EndedKind> = {
  demo_limite_sesion: 'limit',
  demo_limite_ip: 'limit',
  demo_presupuesto: 'limit',
  demo_descansando: 'resting',
  demo_vencida: 'expired',
};

export function endedKindFromState(state: string | null | undefined): EndedKind | null {
  return (state && KIND_BY_STATE[state]) || null;
}

// Fallback for servers that send no `estado`: demo fixed texts are the only replies with a WhatsApp action and no lead code.
export function classifyEndedReply(input: {
  reply: string;
  status: number;
  hasWhatsappAction: boolean;
  hasCode: boolean;
  state?: string | null;
}): EndedKind | null {
  const byState = input.state ? KIND_BY_STATE[input.state] : undefined;
  if (byState) return byState;
  const isFixedText = input.status === 429 || (input.hasWhatsappAction && !input.hasCode);
  if (!isFixedText) return null;
  if (RESTING.test(input.reply)) return 'resting';
  if (EXPIRED.test(input.reply)) return 'expired';
  return 'limit';
}

export function shouldShowRemaining(remaining: number | null): remaining is number {
  return remaining !== null && remaining >= 1 && remaining <= LOW_REMAINING_THRESHOLD;
}
