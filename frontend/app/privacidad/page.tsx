import type { Metadata } from 'next';
import { StructuredData } from '@/shared/components/seo/StructuredData';
import { PrivacyPolicy } from '@/features/legal/components/PrivacyPolicy';
import { SITE_URL } from '@/shared/constants/site';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Qué datos personales recibe AIworks por WhatsApp y correo, para qué los usa y cómo ejercer sus derechos según la LOPDP del Ecuador.',
  alternates: { canonical: `${SITE_URL}/privacidad` },
};

export default function PrivacyPage() {
  return (
    <>
      <StructuredData />
      <PrivacyPolicy />
    </>
  );
}
