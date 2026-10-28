import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WaRedirect } from '@/shared/components/ui/WaRedirect';
import { channelLink, channelSlugs } from '@/shared/lib/waChannels';

export const dynamicParams = false;

export const metadata: Metadata = {
  title: 'WhatsApp',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export function generateStaticParams() {
  return channelSlugs().map((channel) => ({ channel }));
}

export default async function WaChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const href = channelLink((await params).channel);
  if (!href) notFound();
  return <WaRedirect href={href} />;
}
