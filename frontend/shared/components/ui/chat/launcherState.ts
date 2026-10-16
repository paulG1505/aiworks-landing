export const CLOUD_DISMISSED_KEY = 'chat-cloud-dismissed';
export const CLOUD_DELAY_MS = 4000;
export const MOBILE_AUTO_HIDE_MS = 6000;
export const MOBILE_QUERY = '(max-width: 639px)';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface CloudPlan {
  showAfterMs: number;
  autoHideAfterMs: number | null;
}

export function isLauncherRoute(pathname: string | null): boolean {
  return !(pathname === '/demo' || pathname?.startsWith('/demo/'));
}

export function planCloud({
  dismissed,
  isMobile,
}: {
  dismissed: boolean;
  isMobile: boolean;
}): CloudPlan | null {
  if (dismissed) return null;
  return { showAfterMs: CLOUD_DELAY_MS, autoHideAfterMs: isMobile ? MOBILE_AUTO_HIDE_MS : null };
}

// Reading the property itself throws when storage is blocked.
export function getSessionStorage(): StorageLike | null {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function readCloudDismissed(storage: StorageLike | null): boolean {
  try {
    return storage?.getItem(CLOUD_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeCloudDismissed(storage: StorageLike | null): void {
  try {
    storage?.setItem(CLOUD_DISMISSED_KEY, '1');
  } catch {
    // Storage is optional: without it the cloud may show again.
  }
}

export type CtaPosition = 'unknown' | 'on-screen' | 'off-screen';

export function isLauncherHidden({ isOpen, ctaPosition }: { isOpen: boolean; ctaPosition: CtaPosition }): boolean {
  return isOpen || ctaPosition !== 'off-screen';
}
