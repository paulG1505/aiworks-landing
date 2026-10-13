import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const snapshot = () => window.location.pathname + window.location.search;

export function usePathname(): string {
  useSyncExternalStore(subscribe, snapshot, snapshot);
  return window.location.pathname;
}

export function useSearchParams(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => '');
  return new URLSearchParams(search);
}

const router = {
  replace(url: string) {
    window.history.replaceState(null, '', url);
    listeners.forEach((listener) => listener());
  },
  push(url: string) {
    window.history.pushState(null, '', url);
    listeners.forEach((listener) => listener());
  },
};

export function useRouter() {
  return router;
}
