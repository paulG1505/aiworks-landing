import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AIworks - Soluciones de IA',
    short_name: 'AIworks',
    description: 'Transformamos tus datos en decisiones automatizadas con IA',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F23',
    theme_color: '#0066FF',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
