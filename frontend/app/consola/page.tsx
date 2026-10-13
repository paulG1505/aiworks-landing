import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConsoleApp, ConsoleBootFallback } from '@/features/consola';

export const metadata: Metadata = {
  title: 'Consola',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function ConsolePage() {
  return (
    <Suspense fallback={<ConsoleBootFallback />}>
      <ConsoleApp />
    </Suspense>
  );
}
