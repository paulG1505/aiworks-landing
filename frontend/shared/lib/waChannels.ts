import { whatsappLink, whatsappTextLink } from './whatsapp.ts';

export const WA_CHANNELS = {
  ig: 'Hola, vengo de Instagram y me interesa automatizar un proceso en mi empresa.',
  fb: 'Hola, vengo de Facebook y me interesa automatizar un proceso en mi empresa.',
  volante: 'Hola, vengo de un volante de AIworks y me interesa automatizar un proceso en mi empresa.',
} as const;

export type WaChannel = keyof typeof WA_CHANNELS;

export function channelSlugs(): WaChannel[] {
  return Object.keys(WA_CHANNELS) as WaChannel[];
}

export function channelLink(slug?: string): string | null {
  if (slug === undefined) return whatsappLink('es');
  if (!Object.hasOwn(WA_CHANNELS, slug)) return null;
  return whatsappTextLink(WA_CHANNELS[slug as WaChannel]);
}
