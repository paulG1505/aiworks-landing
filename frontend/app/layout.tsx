import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { ChatLauncher } from "@/shared/components/ui/chat/ChatLauncher";
import { StructuredData } from "@/shared/components/seo/StructuredData";
import { StoreRehydrate } from "@/shared/components/providers/StoreRehydrate";
import { MotionProvider } from "@/shared/components/providers/MotionProvider";
import { SITE_URL } from "@/shared/constants/site";
import { THEME_INIT_SCRIPT } from "@/shared/lib/theme";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--face-display",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--face-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--face-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIworks",
    template: "%s | AIworks"
  },
  description: "Su equipo copia datos de un Excel a otro. Construimos el software que hace ese trabajo solo, con revisión humana y registro auditable de cada decisión. Diagnóstico de 15 minutos sin costo.",
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
        alt: "AIworks: software con inteligencia artificial, hecho para el trabajo que su equipo hoy hace a mano. Quito, Ecuador."
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${displayFont.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className="antialiased font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-[var(--tinta)] focus:px-4 focus:py-2 focus:text-[var(--papel)]"
        >
          Saltar al contenido
        </a>
        <StoreRehydrate />
        <StructuredData />
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatLauncher />
        </MotionProvider>
      </body>
    </html>
  );
}
