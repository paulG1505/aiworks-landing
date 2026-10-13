'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/shared/components/ui/Container';
import { CONTACT_INFO } from '@/shared/constants';
import { useTranslation } from '@/shared/hooks/useTranslation';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  const p = t.legal.privacy;

  const withEmail = (text: string) => {
    const [before, after] = text.split('{email}');
    if (after === undefined) return text;
    return (
      <>
        {before}
        <a href={`mailto:${CONTACT_INFO.email}`} className="link text-tinta">
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
            {t.legal.back}
          </Link>
          <h1 className="heading">{p.title}</h1>
          <p className="font-mono text-[0.8125rem] text-tinta-media">{p.updated}</p>
          <p className="text-tinta-media lg:text-[1.1875rem]">{p.intro}</p>

          <div className="mt-6 flex flex-col">
            {p.sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-3 border-t border-regla py-8">
                <h2 className="heading-3">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-tinta-media">
                    {withEmail(paragraph)}
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
