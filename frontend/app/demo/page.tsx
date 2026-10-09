import type { Metadata } from 'next';
import { DemoAssistant } from '@/features/demo/components/DemoAssistant';

export const metadata: Metadata = {
  title: 'Demo',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export default function DemoPage() {
  return <DemoAssistant />;
}
