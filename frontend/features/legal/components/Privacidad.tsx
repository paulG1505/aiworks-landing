'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';

/**
 * Política de privacidad (LOPDP, Ecuador). Describe solo lo que el sitio hace de verdad:
 * sin formularios, sin analítica, contacto por WhatsApp y correo, y tres preferencias
 * locales en el navegador. Si eso cambia (p. ej. se agrega analítica o un formulario),
 * este texto tiene que cambiar en el mismo commit.
 *
 * El texto es un borrador razonable, no asesoría legal: debe revisarlo quien responda
 * legalmente por AIworks antes de publicarse.
 */
export function Privacidad() {
  const { t } = useTranslation();
  const p = t.legal.privacidad;

  const conCorreo = (texto: string) => {
    const [antes, despues] = texto.split('{correo}');
    if (despues === undefined) return texto;
    return (
      <>
        {antes}
        <a href={`mailto:${CONTACT_INFO.email}`} className="enlace text-tinta">
          {CONTACT_INFO.email}
        </a>
        {despues}
      </>
    );
  };

  return (
    <article className="pb-24 pt-32 lg:pb-40 lg:pt-44">
      <Container>
        <div className="flex max-w-[760px] flex-col gap-6">
          <Link href="/" className="group inline-flex w-fit items-center gap-2 text-[0.9375rem] font-medium text-tinta-media hover:text-tinta">
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
            {t.legal.volver}
          </Link>
          <h1 className="titular">{p.titulo}</h1>
          <p className="font-mono text-[0.8125rem] text-tinta-media">{p.actualizado}</p>
          <p className="text-tinta-media lg:text-[1.1875rem]">{p.intro}</p>

          <div className="mt-6 flex flex-col">
            {p.secciones.map((seccion) => (
              <section key={seccion.titulo} className="flex flex-col gap-3 border-t border-regla py-8">
                <h2 className="titular-3">{seccion.titulo}</h2>
                {seccion.parrafos.map((parrafo) => (
                  <p key={parrafo.slice(0, 40)} className="text-tinta-media">
                    {conCorreo(parrafo)}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </article>
  );
}
