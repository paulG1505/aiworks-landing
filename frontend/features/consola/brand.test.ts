import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname);
const GLOBALS = path.resolve(__dirname, '../../app/globals.css');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return name === 'testing' ? [] : sourceFiles(file);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [file] : [];
  });
}

const FORBIDDEN: [string, RegExp][] = [
  ['shadow', /shadow/],
  ['gradient', /gradient/],
  ['hex color', /#[0-9a-fA-F]{3,8}\b/],
  ['rgb()', /rgb\(/],
  ['hsl()', /hsl\(/],
  ['lucide-react', /lucide-react/],
  [
    'default Tailwind palette class',
    /(text|bg|border|ring|fill|stroke|outline|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)/,
  ],
];

describe('Cumplimiento de la marca', () => {
  const files = sourceFiles(ROOT);

  it('Revisión estática', () => {
    expect(files.length).toBeGreaterThan(20);
    const violations = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return FORBIDDEN.filter(([, pattern]) => pattern.test(text)).map(([label]) => `${path.relative(ROOT, file)}: ${label}`);
    });
    expect(violations).toEqual([]);
  });

  it('keeps the only animation to the reader fade, under no-preference', () => {
    const css = readFileSync(GLOBALS, 'utf8');
    const fade = /@media \(prefers-reduced-motion: no-preference\) \{\s*\.console-fade \{\s*animation: console-fade-in 120ms ease-out both;/;
    expect(css).toMatch(fade);
    expect(css).toMatch(/@keyframes console-fade-in \{\s*from \{ opacity: 0; \}\s*to\s+\{ opacity: 1; \}/);
    const used = files.map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(used).not.toMatch(/\b(animate-|transition-|motion\/react)/);
  });

  it('only uses the console-* classes that globals.css defines', () => {
    const css = readFileSync(GLOBALS, 'utf8');
    expect(css).toContain('.console-field');
    expect(css).toContain('.console-fade');
    const stray = files.filter((file) => /className=[^\n]*\bconsole-(?!field\b|fade\b)/.test(readFileSync(file, 'utf8')));
    expect(stray).toEqual([]);
  });
});

function tokens(theme: 'light' | 'dark'): Record<string, string> {
  const css = readFileSync(GLOBALS, 'utf8');
  const read = (block: string) => Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6});/g)].map((m) => [m[1], m[2]]));
  const light = read(/:root \{([^}]*)\}/.exec(css)?.[1] ?? '');
  if (theme === 'light') return light;
  return { ...light, ...read(/html\[data-theme="dark"\] \{([^}]*)\}/.exec(css)?.[1] ?? '') };
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('Contraste de los pares de la consola', () => {
  const PAIRS: [string, string, number][] = [
    ['tinta', 'papel', 4.5],
    ['tinta', 'arena', 4.5],
    ['tinta-media', 'papel', 4.5],
    ['tinta-media', 'arena', 4.5],
    ['marca', 'papel', 4.5],
    ['marca', 'arena', 4.5],
    ['sobre-boton', 'boton', 4.5],
  ];

  for (const theme of ['light', 'dark'] as const) {
    it(`meets WCAG AA in the ${theme} theme`, () => {
      const t = tokens(theme);
      for (const [fg, bg, min] of PAIRS) {
        expect(contrast(t[fg], t[bg]), `${fg} / ${bg}`).toBeGreaterThanOrEqual(min);
      }
      expect(contrast(t['tinta-media'], t.papel), 'field line / papel').toBeGreaterThanOrEqual(3);
      expect(contrast(t.marca, t.papel), 'focus outline / papel').toBeGreaterThanOrEqual(3);
    });
  }
});
