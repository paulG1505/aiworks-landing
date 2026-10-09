import type { Metadata } from 'next';
import { AssistantDemo } from '@/features/demo/components/AssistantDemo';

// Private link for a single prospect: not indexed and not in sitemap.ts.
export const metadata: Metadata = {
  title: 'Demo',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export default function DemoPage() {
  return <AssistantDemo />;
}
