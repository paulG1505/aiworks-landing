'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { enlaceWhatsApp, avisoPestanaNueva } from '@/shared/lib/whatsapp';
import { LogoWhatsApp } from './LogoWhatsApp';

/** La burbuja aparece a los 8 s o al 40 % de scroll, lo que ocurra primero. */
const RETARDO_BURBUJA_MS = 8000;
const SCROLL_BURBUJA = 0.4;
const CLAVE_CERRADA = 'aiworks-burbuja-whatsapp';

/**
 * Botón flotante de WhatsApp, en móvil y escritorio, con una burbuja de invitación.
 * Es la alternativa al chat: va encima del botón del chat (ChatLauncher), que es el principal.
 *
 * Lleva el verde de WhatsApp: es la marca que la gente reconoce al instante, y aquí es
 * la única excepción al acento único. El logo va en verde muy oscuro y no en blanco:
 * blanco sobre #25D366 da 1,98:1 y #0B3D1F da 6,2:1. El borde más oscuro separa el botón
 * del fondo claro, donde el verde solo daría 1,84:1.
 *
 * La burbuja se puede cerrar y no vuelve en esa visita (sessionStorage). Botón y burbuja
 * se ocultan mientras el cierre de contacto está en pantalla, que ya tiene su propio CTA.
 *
 * Movimiento (Motion): la burbuja entra desde abajo con un resorte corto y sale al
 * cerrarla; el botón crece apenas al pasar el mouse y se hunde al pulsar. Con
 * prefers-reduced-motion, MotionConfig deja solo el cambio de opacidad.
 */
export function FloatingWhatsApp() {
  const { t, locale } = useTranslation();
  const ruta = usePathname();
  const [burbuja, setBurbuja] = useState(false);
  // Se lee al montar; como la burbuja arranca oculta, el HTML inicial es el mismo en
  // servidor y cliente y no hay desajuste de hidratación.
  const [cerrada, setCerrada] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !!sessionStorage.getItem(CLAVE_CERRADA);
    } catch {
      return false;
    }
  });
  const [enContacto, setEnContacto] = useState(false);

  useEffect(() => {
    const temporizador = window.setTimeout(() => setBurbuja(true), RETARDO_BURBUJA_MS);
    let frame = 0;
    const medir = () => {
      frame = 0;
      const recorrido = document.documentElement.scrollHeight - window.innerHeight;
      if (recorrido > 0 && window.scrollY / recorrido >= SCROLL_BURBUJA) setBurbuja(true);
      const contacto = document.getElementById('contacto');
      setEnContacto(!!contacto && contacto.getBoundingClientRect().top < window.innerHeight * 0.85);
    };
    const alScroll = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll);
    return () => {
      window.clearTimeout(temporizador);
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const cerrar = () => {
    setCerrada(true);
    try {
      sessionStorage.setItem(CLAVE_CERRADA, '1');
    } catch {
      // Ídem: sin almacenamiento, el cierre dura hasta recargar.
    }
  };

  // La página de demo trae su propio llamado a la acción y su propio chat.
  if (ruta?.startsWith('/demo')) return null;

  const href = enlaceWhatsApp(locale);
  const etiqueta = `${t.header.cta} ${avisoPestanaNueva(locale)}`;

  return (
    <div
      className={`fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] right-5 z-40 flex items-end gap-3 transition-opacity duration-200 lg:bottom-[6.75rem] lg:right-8 ${
        enContacto ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={enContacto || undefined}
    >
      <AnimatePresence>
        {burbuja && !cerrada && (
          <m.div
            key="burbuja"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={{ transformOrigin: 'bottom right' }}
            className="relative flex max-w-[calc(100vw-7rem)] items-start gap-3 rounded-2xl border border-regla bg-papel py-3.5 pl-4 pr-10 text-tinta shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
          >
            <span
              className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[#25D366] shadow-[0_0_0_3px_rgb(37_211_102/0.25)]"
              aria-hidden="true"
            />
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={etiqueta}
              className="flex flex-col"
            >
              <span className="font-semibold leading-snug">{t.whatsappFlotante.titulo}</span>
              <span className="text-[0.9375rem] leading-snug text-tinta-media">
                {t.whatsappFlotante.texto}
              </span>
            </a>
            <button
              type="button"
              onClick={cerrar}
              aria-label={t.whatsappFlotante.cerrar}
              className="absolute right-2 top-2 cursor-pointer rounded-full p-1.5 text-tinta-media transition-colors duration-150 hover:bg-arena hover:text-tinta"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <m.a
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={enContacto ? -1 : undefined}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#128C4A] bg-[#25D366] text-[#0B3D1F] shadow-[0_12px_28px_-12px_rgb(0_0_0/0.45)] hover:bg-[#20BD5A]"
        aria-label={etiqueta}
      >
        <LogoWhatsApp className="size-6" />
      </m.a>
    </div>
  );
}
