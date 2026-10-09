import { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/constants/site';

export const dynamic = 'force-static';

// Anchors must match the section ids the page actually renders.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-28');

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/#servicios`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/#procesos`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/#proceso`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/#porque`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/#preguntas`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/#contacto`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/privacidad`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
