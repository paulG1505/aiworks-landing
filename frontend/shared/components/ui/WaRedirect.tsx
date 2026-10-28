export function WaRedirect({ href }: { href: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(href)})` }} />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p>Abriendo WhatsApp…</p>
        <p className="mt-4">
          <a className="underline" href={href}>
            Si no se abre, toque aquí para escribirnos por WhatsApp
          </a>
        </p>
      </div>
    </>
  );
}
