export type DemoSector = 'comercio' | 'salud' | 'finanzas' | 'logistica';

export interface SectorDemo {
  slug: string;
  sector: DemoSector;
  businessName: string;
}

// Fictitious companies only: client slugs never live in this public repo.
export const SECTOR_DEMOS: readonly SectorDemo[] = [
  { slug: 'sector-comercio', sector: 'comercio', businessName: 'Mercadito Quillay' },
  { slug: 'sector-salud', sector: 'salud', businessName: 'Clínica Santa Aurelia' },
  { slug: 'sector-finanzas', sector: 'finanzas', businessName: 'Cooperativa de Ahorro y Crédito Alto Yacu' },
  { slug: 'sector-logistica', sector: 'logistica', businessName: 'Envíos Ruta Cóndor' },
];

export function findSectorDemo(slug: string): SectorDemo | undefined {
  return SECTOR_DEMOS.find((demo) => demo.slug === slug);
}

export function isDemoSector(value: string | null): value is DemoSector {
  return SECTOR_DEMOS.some((demo) => demo.sector === value);
}
