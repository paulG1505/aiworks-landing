import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { FloatingWhatsApp } from "@/shared/components/ui/FloatingWhatsApp";
import { StructuredData } from "@/shared/components/seo/StructuredData";
import { StoreRehydrate } from "@/shared/components/providers/StoreRehydrate";
import { SITE_URL } from "@/shared/constants/site";
import { CLAVE_TEMA } from "@/shared/lib/tema";
import "./globals.css";

// Tres voces, una por función: Bricolage Grotesque para titulares, Geist para cuerpo y
// UI, Geist Mono para eyebrows y el registro operativo. next/font las sirve desde el
// propio dominio (sin petición a Google en el navegador) y reserva su métrica para evitar
// saltos de layout. Bricolage es variable: se carga el eje de tamaño óptico (opsz), que
// abre el espaciado en tamaños chicos y lo cierra en el titular grande.
const titular = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--fuente-titular",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--fuente-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--fuente-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIworks | Automatización de procesos con IA en Quito",
    template: "%s | AIworks"
  },
  description: "Su equipo copia datos de un Excel a otro. Construimos el software que hace ese trabajo solo, con revisión humana y registro auditable de cada decisión. Diagnóstico de 15 minutos sin costo.",
  // Alineadas con los tres procesos que la página desarrolla de verdad. Antes
  // apuntaban a "chatbots" como producto genérico, que ahora es solo uno de los tres.
  keywords: [
    "automatización de procesos con IA",
    "conciliación bancaria automática",
    "automatizar cierre de mes",
    "lectura automática de documentos",
    "asistente de atención al cliente con IA",
    "software con inteligencia artificial Ecuador",
    "automatización para cooperativas",
    "consultora de software Quito"
  ],
  authors: [{ name: "AIworks", url: SITE_URL }],
  creator: "AIworks",
  publisher: "AIworks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: SITE_URL,
    title: "AIworks | Automatización de procesos con IA en Quito",
    description: "Construimos el software que hace el trabajo de digitar, con revisión humana y registro auditable. Diagnóstico de 15 minutos sin costo.",
    siteName: "AIworks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIworks — No vendemos software, resolvemos ineficiencia. Quito, Ecuador."
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIworks | Automatización de procesos con IA en Quito",
    description: "Construimos el software que hace el trabajo de digitar, con revisión humana y registro auditable. Diagnóstico de 15 minutos sin costo.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
};

const SCRIPT_INICIAL = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('${CLAVE_TEMA}')}catch(e){}if(t!=='claro'&&t!=='oscuro'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'oscuro':'claro'}d.setAttribute('data-tema',t)})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${titular.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/*
          * Antes del primer pintado:
          * 1. Marca que hay JavaScript. Los revelados al hacer scroll solo ocultan contenido
          *    bajo `html.js`: sin JS, o si el script falla, todo se ve.
          * 2. Resuelve el tema (elección guardada o, si no hay, la del sistema) para que
          *    la página no parpadee en claro antes de pasar a oscuro.
          */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIAL }} />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className="antialiased font-sans">
        {/*
          * Saltar al contenido: con el header fijo, quien navega con teclado tenía que
          * pasar por el logo, cinco enlaces, el selector de idioma y el CTA antes de
          * llegar al contenido. Visible solo al recibir foco.
          */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-[var(--tinta)] focus:px-4 focus:py-2 focus:text-[var(--papel)]"
        >
          Saltar al contenido
        </a>
        <StoreRehydrate />
        <StructuredData />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
