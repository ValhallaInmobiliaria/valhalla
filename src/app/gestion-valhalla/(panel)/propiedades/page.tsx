import Link from "next/link";
import { Plus } from "lucide-react";
import PropertyList from "@/components/admin/PropertyList";
import { requireAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import type { Propiedad } from "@/types/propiedad";

export const dynamic = "force-dynamic";

export default async function GestionPropiedadesPage() {
    await requireAdmin();

    const { data } = await supabase
        .from("propiedades")
        .select("*")
        .order("created_at", { ascending: false });

    const properties = (data ?? []) as Propiedad[];

    return (
        <div className="space-y-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
                        Inventario inmobiliario
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0016A2] sm:text-4xl">
                        Propiedades
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Busca, revisa, edita o elimina propiedades sin salir del
                        panel.
                    </p>
                </div>

                <Link
                    href="/gestion-valhalla/nueva"
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0016A2] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0016A2]/15 transition hover:-translate-y-0.5 hover:bg-[#0a28c4]"
                >
                    <Plus size={17} />
                    Nueva propiedad
                </Link>
            </div>

            <PropertyList properties={properties} />
        </div>
    );
}
