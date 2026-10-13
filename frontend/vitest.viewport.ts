export type Viewport = 'desktop' | 'mobile';

let viewport: Viewport = 'desktop';
const listeners = new Set<() => void>();

export function setViewport(next: Viewport): void {
  viewport = next;
  listeners.forEach((listener) => listener());
}

export function resetViewport(): void {
  viewport = 'desktop';
  listeners.clear();
}

export function matchesQuery(query: string): boolean {
  const min = /\(min-width:\s*(\d+)px\)/.exec(query);
  if (!min) return false;
  return (viewport === 'desktop' ? 1280 : 390) >= Number(min[1]);
}

export function onViewportChange(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
