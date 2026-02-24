import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { FloatingWhatsApp } from "@/shared/components/ui/FloatingWhatsApp";
import { StructuredData } from "@/shared/components/seo/StructuredData";
import { StoreRehydrate } from "@/shared/components/providers/StoreRehydrate";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aiworks.dev'),
  title: {
    default: "AIworks | Desarrollo de Software con Inteligencia Artificial y Chatbots",
    template: "%s | AIworks"
  },
  description: "Empresa líder en desarrollo de software con inteligencia artificial, chatbots IA y automatización empresarial. Creamos soluciones personalizadas con IA para Fintech, Retail, Logística y Salud. Consultores expertos en machine learning y procesamiento de datos.",
  keywords: [
    // Palabras clave principales
    "desarrollo software inteligencia artificial",
    "chatbots con IA",
    "chatbot inteligente",
    "desarrollo chatbot personalizado",
    "software con inteligencia artificial",
    "empresa desarrollo IA",
    "automatización con IA",
    "soluciones IA empresariales",
    // Long-tail keywords
    "desarrollo software IA México",
    "crear chatbot con inteligencia artificial",
    "empresa chatbots IA",
    "desarrollo aplicaciones machine learning",
    "automatización procesos IA",
    "consultoría inteligencia artificial",
    "integración IA empresas",
    // Keywords por industria
    "IA para fintech",
    "IA para retail",
    "IA para logística",
    "IA para salud",
    // Términos técnicos
    "machine learning",
    "procesamiento lenguaje natural",
    "NLP español",
    "AI development",
    "custom AI solutions"
  ],
  authors: [{ name: "AIworks", url: "https://aiworks.dev" }],
  creator: "AIworks",
  publisher: "AIworks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://aiworks.dev",
    title: "AIworks | Desarrollo de Software con Inteligencia Artificial y Chatbots",
    description: "Empresa líder en desarrollo de software con IA, chatbots inteligentes y automatización empresarial. Soluciones personalizadas con machine learning para tu negocio.",
    siteName: "AIworks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIworks - Desarrollo de Software con Inteligencia Artificial"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIworks | Desarrollo de Software con Inteligencia Artificial y Chatbots",
    description: "Empresa líder en desarrollo de software con IA, chatbots y automatización empresarial",
    creator: "@aiworks",
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
    canonical: "https://aiworks.dev",
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for WhatsApp */}
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className={`${inter.variable} antialiased font-sans`}>
        <StoreRehydrate />
        <StructuredData />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
