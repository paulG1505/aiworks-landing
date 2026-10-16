import type { InfoResult, TenantInfo } from '../../../shared/components/ui/chat/api.ts';
import type { EndedKind } from '../../../shared/components/ui/chat/endedReply.ts';
import type { DemoHash } from '../../../shared/lib/demoSlug.ts';

export type DemoState =
  | { phase: 'loading' }
  | { phase: 'gallery' }
  | { phase: 'ok' | 'resting'; slug: string; info: TenantInfo }
  | { phase: 'unavailable' }
  | { phase: 'error' };

// null means the hash names a demo that still has to be fetched.
export function phaseForHash(hash: DemoHash): DemoState | null {
  if (hash.kind === 'none') return { phase: 'gallery' };
  if (hash.kind === 'invalid') return { phase: 'unavailable' };
  return null;
}

export function phaseFromInfo(slug: string, result: InfoResult): DemoState {
  return result.status === 'ok' ? { phase: 'ok', slug, info: result.info } : { phase: result.status };
}

export function phaseOnEnded(view: DemoState, ended: EndedKind | null): DemoState {
  if (ended === 'expired') return { phase: 'unavailable' };
  if (ended === 'resting' && view.phase === 'ok') return { ...view, phase: 'resting' };
  return view;
}
