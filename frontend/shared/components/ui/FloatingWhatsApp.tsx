'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';

/**
 * Solo en móvil. En escritorio el CTA de WhatsApp del header ya está siempre visible
 * (el header es fijo), así que el botón flotante sería el tercer botón verde en
 * pantalla compitiendo con los otros dos.
 */
export function FloatingWhatsApp() {
  const { t, locale } = useTranslation();
  const whatsappUrl = enlaceWhatsApp(locale);
  const whatsappAriaLabel = `${t.header.cta} ${avisoPestanaNueva(locale)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-[var(--verde-whatsapp)] rounded-full flex items-center justify-center hover:bg-[var(--verde-whatsapp-hover)] transition-colors duration-150"
      aria-label={whatsappAriaLabel}
    >
      {/* Icono en #06301A (mismo tono que .accion-whatsapp usa para su texto en
          globals.css): blanco sobre --verde-whatsapp da 1.98:1, bajo el 3:1 que
          exige WCAG 1.4.11 para componentes gráficos. Con #06301A el ratio sube
          por encima de 4:1. */}
      <MessageCircle className="w-5 h-5 text-[#06301A]" />
    </a>
  );
}
