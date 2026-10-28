import type { Metadata } from 'next';
import { WaRedirect } from '@/shared/components/ui/WaRedirect';
import { channelLink } from '@/shared/lib/waChannels';

export const metadata: Metadata = {
  title: 'WhatsApp',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export default function WaPage() {
  return <WaRedirect href={channelLink()!} />;
}
