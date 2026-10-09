'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';

// The policy must describe only what the site really does: if analytics or a form is added,
// update the text in the same commit. It is a draft, not legal advice.
export function Privacy() {
  const { t } = useTranslation();
  const p = t.legal.privacidad;

  const withEmail = (text: string) => {
    const [before, after] = text.split('{correo}');
    if (after === undefined) return text;
    return (
      <>
        {before}
        <a href={`mailto:${CONTACT_INFO.email}`} className="enlace text-tinta">
          {CONTACT_INFO.email}
        </a>
        {after}
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
                    {withEmail(parrafo)}
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
