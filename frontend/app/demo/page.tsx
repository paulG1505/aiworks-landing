import type { Metadata } from 'next';
import { DemoAsistente } from '@/features/demo/components/DemoAsistente';

// Enlace privado de un prospecto: no se indexa y no está en sitemap.ts.
export const metadata: Metadata = {
  title: 'Demo',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export default function PaginaDemo() {
  return <DemoAsistente />;
}
