import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCatalog from "@/components/property/PropertyCatalog";
import { supabase } from "@/lib/supabase";
import { isForSale } from "@/lib/property-operation";

export const metadata = {
  title: "Comprar propiedades",
  description:
    "Encuentra propiedades disponibles para comprar en Valhalla Inmobiliaria.",
};

export default async function ComprarPage() {
  const { data: properties, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando propiedades:", error);
  }

  // Solo pasan al catálogo las propiedades publicadas que aplican a venta.
  // "Venta y Arriendo" aparece también aquí.
  const saleProperties = (properties ?? []).filter((property) =>
    isForSale(property.operacion)
  );

  return (
    <main className="min-h-screen bg-[#F3F7FC]">
      <Navbar />

      <section className="bg-[#0016A2] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-[#79C2EF]"
          >
            <ArrowLeft size={16} />
            Inicio
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#79C2EF]">
              Compra
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              Encuentra el lugar para tu próxima etapa.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explora las propiedades publicadas y utiliza los filtros para
              encontrar una opción que encaje contigo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <PropertyCatalog
          properties={saleProperties}
          initialOperation="venta"
        />

        <div className="mt-16 rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,22,162,0.06)] sm:p-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0016A2]">
            Acompañamiento
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0016A2]">
            ¿Necesitas orientación para comprar?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            Comunícate con Valhalla para recibir información sobre las
            propiedades disponibles.
          </p>
          <Link
            href="/contacto"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0016A2] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#79C2EF] hover:text-[#0016A2]"
          >
            Hablar con nosotros <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
