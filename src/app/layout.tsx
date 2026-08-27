import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Valhalla Inmobiliaria", template: "%s | Valhalla Inmobiliaria" },
  description: "Soluciones inmobiliarias para comprar, vender y arrendar propiedades.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
