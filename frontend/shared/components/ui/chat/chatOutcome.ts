import type { ChatAction, ChatResult } from './api.ts';
import { classifyEndedReply, endedKindFromState, type EndedKind } from './endedReply.ts';

export type ChatOutcome =
  | { type: 'ended'; kind: EndedKind; text: string | null }
  | { type: 'reply'; text: string; action: ChatAction | null; remaining: number | null; endsAfter: boolean }
  | { type: 'failure' };

// `text: null` on an ended outcome means "use the default text for this kind".
export function resolveChatOutcome(result: ChatResult, isDemo: boolean): ChatOutcome {
  if (result.ok) {
    const kind = isDemo
      ? classifyEndedReply({
          reply: result.reply,
          status: 200,
          hasWhatsappAction: result.action !== null,
          hasCode: Boolean(result.action?.code),
          state: result.state,
        })
      : null;
    if (kind) return { type: 'ended', kind, text: result.reply };
    return {
      type: 'reply',
      text: result.reply,
      action: result.action,
      remaining: result.remaining,
      endsAfter: isDemo && result.remaining === 0,
    };
  }
  if (isDemo && result.reason === 'limit') {
    const kind = endedKindFromState(result.state);
    if (kind) return { type: 'ended', kind, text: result.reply };
  }
  return { type: 'failure' };
}
