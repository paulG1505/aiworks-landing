'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from '@/shared/hooks/useTranslation';
import { avisoPestanaNueva, enlaceWhatsApp } from '@/shared/lib/whatsapp';
import {
  MAX_CARACTERES,
  enviarMensaje,
  guardarSesion,
  leerSesion,
  type AccionChat,
} from './api';
import { TEXTOS_CHAT } from './textos';

interface Mensaje {
  id: number;
  rol: 'usuario' | 'asistente';
  texto: string;
  accion?: AccionChat | null;
}

interface Props {
  /** `aiworks` o `demo-<código>`: el tenant al que se escribe. */
  tenant: string;
  bienvenida?: string;
  sugerencias?: readonly string[];
  /** Pie propio de AIworks. La demo habla como el negocio y lo oculta. */
  conPie?: boolean;
  /** Si falla la red, ofrecer el WhatsApp de AIworks. La demo no lo ofrece dentro del chat. */
  respaldoWhatsapp?: boolean;
  /** Pone el foco en el campo al montar o al volver a mostrarse. */
  enfocar?: boolean;
}

/**
 * Núcleo del chat: lista de mensajes, sugerencias, campo y pie. Lo usan el panel flotante
 * (PanelChat) y la página de demo, que lo incrusta tal cual.
 *
 * Estilo: sin burbujas ni tarjetas. Cada mensaje es una fila con filete y un rótulo en
 * mono; lo del visitante lleva una regla fina de petróleo a la izquierda.
 */
export function Conversacion({
  tenant,
  bienvenida,
  sugerencias,
  conPie = true,
  respaldoWhatsapp = true,
  enfocar = false,
}: Props) {
  const { locale } = useTranslation();
  const tx = TEXTOS_CHAT[locale];
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const idCampo = useId();
  const idContador = useId();
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);
  const siguienteId = useRef(1);
  const sesion = useRef<string | null>(null);
  const abortar = useRef<AbortController | null>(null);

  const textoBienvenida = bienvenida ?? tx.bienvenida;
  const opciones = sugerencias ?? tx.sugerencias;
  const sinConversar = mensajes.length === 0;

  useEffect(() => {
    sesion.current = leerSesion(tenant);
    const control = new AbortController();
    abortar.current = control;
    return () => control.abort();
  }, [tenant]);

  useEffect(() => {
    if (enfocar) campo.current?.focus();
  }, [enfocar]);

  // Cada mensaje nuevo (o el indicador) lleva la lista al final.
  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes, enviando]);

  // El campo crece con el texto hasta 5 líneas.
  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [texto]);

  const agregar = (m: Omit<Mensaje, 'id'>) =>
    setMensajes((previos) => [...previos, { ...m, id: siguienteId.current++ }]);

  const enviar = async (contenido: string) => {
    const mensaje = contenido.trim();
    if (!mensaje || enviando || mensaje.length > MAX_CARACTERES) return;
    agregar({ rol: 'usuario', texto: mensaje });
    setTexto('');
    setEnviando(true);

    const resultado = await enviarMensaje(
      tenant,
      { sesionId: sesion.current, mensaje, idioma: locale },
      abortar.current?.signal,
    );
    if (abortar.current?.signal.aborted) return;

    if (resultado.ok) {
      if (resultado.sesionId) {
        sesion.current = resultado.sesionId;
        guardarSesion(tenant, resultado.sesionId);
      }
      agregar({ rol: 'asistente', texto: resultado.respuesta, accion: resultado.accion });
    } else if (respaldoWhatsapp) {
      agregar({
        rol: 'asistente',
        texto: tx.respaldo,
        accion: { tipo: 'whatsapp', url: enlaceWhatsApp(locale), codigo: null },
      });
    } else {
      agregar({ rol: 'asistente', texto: tx.respaldoSinWhatsapp });
    }
    setEnviando(false);
    campo.current?.focus();
  };

  const alEnviar = (e: FormEvent) => {
    e.preventDefault();
    void enviar(texto);
  };

  const alTeclear = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void enviar(texto);
    }
  };

  const restantes = MAX_CARACTERES - texto.length;
  const casiLleno = restantes <= 100;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={lista}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 pt-1"
      >
        <Fila rol="asistente" etiqueta={tx.rolAsistente} primero>
          {textoBienvenida}
        </Fila>

        {sinConversar && (
          <div className="mt-5">
            <p className="eyebrow !text-[0.6875rem]">{tx.sugerenciasTitulo}</p>
            <ul className="mt-3">
              {opciones.map((s) => (
                <li key={s} className="border-t border-regla last:border-b">
                  <button
                    type="button"
                    onClick={() => void enviar(s)}
                    disabled={enviando}
                    className="w-full cursor-pointer py-3 text-left text-[0.9375rem] leading-snug text-tinta transition-colors duration-150 hover:text-marca disabled:cursor-default"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mensajes.map((m) => (
          <Fila
            key={m.id}
            rol={m.rol}
            etiqueta={m.rol === 'usuario' ? tx.rolUsuario : tx.rolAsistente}
          >
            {m.texto}
            {m.accion && (
              <div className="mt-4 flex flex-col items-start gap-2.5">
                <a
                  href={m.accion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${tx.continuarWhatsapp} ${avisoPestanaNueva(locale)}`}
                  className="accion accion-primaria !px-5 !py-3 !text-[0.9375rem]"
                >
                  {tx.continuarWhatsapp}
                </a>
                {m.accion.codigo && (
                  <p className="text-[0.8125rem] text-tinta-media">
                    {tx.codigo}{' '}
                    <span className="tabular rounded-sm border border-regla px-1.5 py-0.5 text-[0.8125rem] font-medium text-tinta">
                      {m.accion.codigo}
                    </span>
                  </p>
                )}
              </div>
            )}
          </Fila>
        ))}

        {enviando && (
          <div className="chat-mensaje border-t border-regla py-4" role="status">
            <p className="eyebrow !text-[0.6875rem]">{tx.rolAsistente}</p>
            <p className="mt-2 flex items-center gap-2 text-[0.875rem] text-tinta-media">
              <span className="flex gap-1" aria-hidden="true">
                <span className="escribiendo-punto" style={{ ['--d' as string]: '0ms' }} />
                <span className="escribiendo-punto" style={{ ['--d' as string]: '160ms' }} />
                <span className="escribiendo-punto" style={{ ['--d' as string]: '320ms' }} />
              </span>
              {tx.escribiendo}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={alEnviar} className="border-t border-regla px-5 pb-4 pt-4">
        <label htmlFor={idCampo} className="sr-only">
          {tx.campo}
        </label>
        <textarea
          id={idCampo}
          ref={campo}
          rows={1}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alTeclear}
          placeholder={tx.placeholder}
          aria-describedby={idContador}
          maxLength={MAX_CARACTERES}
          className="block max-h-[132px] w-full resize-none rounded-md border border-[var(--regla-arena)] bg-transparent px-3.5 py-3 text-[1rem] leading-snug text-tinta placeholder:text-tinta-media focus:border-marca focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p
            id={idContador}
            aria-label={tx.caracteres(texto.length, MAX_CARACTERES)}
            className={`tabular text-[0.75rem] ${casiLleno ? 'text-tinta' : 'text-tinta-media'}`}
          >
            {texto.length}/{MAX_CARACTERES.toLocaleString('es-EC')}
          </p>
          <button
            type="submit"
            disabled={enviando || !texto.trim()}
            className="accion accion-primaria cursor-pointer !px-5 !py-2.5 !text-[0.9375rem] disabled:cursor-not-allowed disabled:bg-arena disabled:text-tinta-media disabled:hover:translate-y-0"
          >
            {tx.enviar}
          </button>
        </div>
        {conPie && (
          <div className="mt-4 border-t border-regla pt-3 text-[0.75rem] leading-snug text-tinta-media">
            <p>{tx.pieValores}</p>
            <p className="mt-0.5 text-tinta">{tx.pieCierre}</p>
          </div>
        )}
      </form>
    </div>
  );
}

function Fila({
  rol,
  etiqueta,
  primero = false,
  children,
}: {
  rol: 'usuario' | 'asistente';
  etiqueta: string;
  primero?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`chat-mensaje relative py-4 ${primero ? '' : 'border-t border-regla'} ${
        rol === 'usuario'
          ? 'pl-4 before:absolute before:bottom-4 before:left-0 before:top-4 before:w-px before:bg-marca'
          : ''
      }`}
    >
      {/* Quién habla: lo marca el filete petróleo del visitante; el rótulo queda para lectores de pantalla */}
      <p className="sr-only">{etiqueta}</p>
      <div
        className={`whitespace-pre-line text-[1rem] leading-relaxed ${
          rol === 'usuario' ? 'text-tinta-media' : 'text-tinta'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
