'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';

// El panel es un chunk aparte: no se descarga hasta el primer clic.
const PanelChat = dynamic(() => import('./PanelChat'), { ssr: false });

// Estas dos frases viven aquí y no en textos.ts porque el lanzador va en la primera carga.
const ETIQUETA = { es: 'Pregúntenos', en: 'Ask us' } as const;
const ARIA = {
  es: 'Abrir el chat con el asistente de AIworks',
  en: 'Open the chat with the AIworks assistant',
} as const;

/**
 * Botón principal flotante. El de WhatsApp queda encima, más chico, como alternativa.
 * En la página de demo no se muestra: allí el chat ya está en la página.
 */
export function ChatLauncher() {
  const { locale } = useTranslation();
  const ruta = usePathname();
  const [cargado, setCargado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const habiaAbierto = useRef(false);

  // Al cerrar, el foco vuelve al botón que abrió el panel.
  useEffect(() => {
    if (habiaAbierto.current && !abierto) boton.current?.focus();
    habiaAbierto.current = abierto;
  }, [abierto]);

  if (ruta?.startsWith('/demo')) return null;

  return (
    <>
      <button
        ref={boton}
        type="button"
        onClick={() => {
          setCargado(true);
          setAbierto(true);
        }}
        aria-label={ARIA[locale]}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        className={`accion accion-primaria fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5 z-40 cursor-pointer !px-6 !py-4 lg:bottom-8 lg:right-8 ${
          abierto ? 'invisible' : ''
        }`}
      >
        {ETIQUETA[locale]}
      </button>
      {cargado && <PanelChat abierto={abierto} alCerrar={() => setAbierto(false)} />}
    </>
  );
}
