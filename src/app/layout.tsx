import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Valhalla Inmobiliaria | Compra, Venta y Arriendo de Propiedades",
    template: "%s | Valhalla Inmobiliaria",
  },

  description:
    "Valhalla Inmobiliaria ofrece servicios de compra, venta y arriendo de casas, apartamentos y propiedades en Colombia.",

  keywords: [
    "Valhalla Inmobiliaria",
    "inmobiliaria",
    "compra de casas",
    "venta de apartamentos",
    "arriendo de propiedades",
    "propiedades en Colombia",
  ],

  authors: [
    {
      name: "Valhalla Inmobiliaria",
    },
  ],

  creator: "Valhalla Inmobiliaria",

  openGraph: {
    title: "Valhalla Inmobiliaria",
    description:
      "Compra, venta y arriendo de propiedades. Encuentra tu próximo hogar con Valhalla Inmobiliaria.",
    url: "https://valhallainmobiliaria.vercel.app",
    siteName: "Valhalla Inmobiliaria",
    locale: "es_CO",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}