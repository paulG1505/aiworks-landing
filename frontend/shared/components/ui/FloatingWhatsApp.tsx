'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

/**
 * Solo en móvil. En escritorio el CTA de WhatsApp del header ya está siempre visible.
 *
 * Tinta sobre papel, como el resto de acciones (sin el verde de marca de WhatsApp, que
 * sería un segundo acento). El borde en papel lo mantiene visible cuando pasa sobre las
 * bandas oscuras, donde tinta sobre noche daría 1.04:1.
 */
export function FloatingWhatsApp() {
  const { t, locale } = useTranslation();

  return (
    <a
      href={enlaceWhatsApp(locale)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-papel/60 bg-tinta text-papel transition-colors duration-150 hover:bg-black lg:hidden"
      aria-label={`${t.header.cta} ${avisoPestanaNueva(locale)}`}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
    </a>
  );
}
