import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCatalog from "@/components/property/PropertyCatalog";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Propiedades",
  description:
    "Explora el catálogo de propiedades de Valhalla Inmobiliaria.",
};

export default async function PropiedadesPage() {
  const { data: properties, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando propiedades:", error);
  }

  const propertyList = properties ?? [];

  return (
    <main className="min-h-screen bg-[#F3F7FC]">
      <Navbar />

      <section className="relative overflow-hidden bg-[#0016A2] text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#79C2EF]/20 blur-3xl" />
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
              Portafolio Valhalla
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              Encuentra tu próxima propiedad.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explora las propiedades actualmente publicadas y utiliza los
              filtros para acercarte a lo que estás buscando.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-[#0016A2]">
              {propertyList.length}{" "}
              {propertyList.length === 1
                ? "propiedad publicada"
                : "propiedades publicadas"}
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#0016A2]">
              Nuestro catálogo
            </h2>
          </div>

          <Link
            href="/contacto"
            className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#0016A2] hover:text-[#79C2EF]"
          >
            ¿Tienes una propiedad? <ArrowRight size={16} />
          </Link>
        </div>

        <PropertyCatalog properties={propertyList} />
      </section>

      <Footer />
    </main>
  );
}
