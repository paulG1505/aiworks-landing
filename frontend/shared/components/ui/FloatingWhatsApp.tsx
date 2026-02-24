'use client';

import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/shared/constants';

export function FloatingWhatsApp() {
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me interesa saber más sobre sus soluciones de IA para mi negocio.'
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-[var(--verde-whatsapp)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[var(--verde-whatsapp)] animate-ping opacity-75 motion-reduce:animate-none" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¡Chatea con nosotros!
      </span>
    </a>
  );
}
