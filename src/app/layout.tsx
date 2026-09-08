import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://valhallainmobiliaria.vercel.app"),

  title: {
    default: "Valhalla Inmobiliaria | Compra, Venta y Arriendo de Propiedades",
    template: "%s | Valhalla Inmobiliaria",
  },

  description:
    "Valhalla Inmobiliaria ofrece servicios de compra, venta y arriendo de casas, apartamentos y propiedades.",

  keywords: [
    "Valhalla Inmobiliaria",
    "inmobiliaria",
    "venta de propiedades",
    "arriendo de propiedades",
    "casas en venta",
    "apartamentos en venta",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Valhalla Inmobiliaria",
    description:
      "Compra, venta y arriendo de propiedades con Valhalla Inmobiliaria.",
    url: "https://valhallainmobiliaria.vercel.app",
    siteName: "Valhalla Inmobiliaria",
    locale: "es_CO",
    type: "website",
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