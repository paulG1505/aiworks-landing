export const DEMO_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const DEMO_SLUG_MIN_LENGTH = 6;
export const DEMO_SLUG_MAX_LENGTH = 48;

// Shared with the assistant repo: both sides must accept and reject exactly these.
export const DEMO_SLUG_EXAMPLES = {
  valid: ['tienda-ejemplo-k3m9x2', 'sector-salud', 'abcdef', 'otra-tienda-7h2k9p', 'a1b2c3'],
  invalid: ['abc', 'demo_x', '-abcdef', 'abcdef-', 'abc--def', 'Tienda-Ejemplo', 'abcdef04hvice/x', 'abc-def\n', 'a\n', ''],
} as const;

export type DemoHash = { kind: 'none' } | { kind: 'invalid' } | { kind: 'slug'; slug: string };

export function isValidDemoSlug(value: string): boolean {
  return (
    value.length >= DEMO_SLUG_MIN_LENGTH &&
    value.length <= DEMO_SLUG_MAX_LENGTH &&
    DEMO_SLUG_PATTERN.test(value)
  );
}

export function parseDemoHash(hash: string): DemoHash {
  const value = hash.trim().replace(/^#/, '').trim();
  if (!value) return { kind: 'none' };
  return isValidDemoSlug(value) ? { kind: 'slug', slug: value } : { kind: 'invalid' };
}

export function demoTenantId(slug: string): string {
  return `demo-${slug}`;
}
