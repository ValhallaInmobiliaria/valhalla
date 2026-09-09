import PropertyCard from "@/components/property/PropertyCard";
import { supabase } from "@/lib/supabase";

export default async function FeaturedProperties() {
  const { data: properties, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("publicado", true)
    .eq("destacado", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return (
      <section className="bg-[#F3F7FC] py-20">
        <div className="mx-auto max-w-7xl px-5 text-center text-slate-500 sm:px-8 lg:px-10">
          No fue posible cargar las propiedades destacadas.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F3F7FC] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0016A2]">
            Selección Valhalla
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0016A2]">
            Propiedades destacadas
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-500">
            Descubre las propiedades marcadas como destacadas en el catálogo.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {properties?.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            Actualmente no hay propiedades destacadas.
          </div>
        )}
      </div>
    </section>
  );
}
