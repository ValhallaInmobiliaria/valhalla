import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import Dashboard from "@/components/admin/Dashboard";
import { requireAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function GestionDashboardPage() {
    await requireAdmin();

    const { data: properties } = await supabase
        .from("propiedades")
        .select(
            "id,titulo,ciudad,precio,operacion,estado,imagen_principal,destacado"
        );

    const list = properties ?? [];

    const total = list.length;
    const venta = list.filter((property) => property.operacion === "Venta").length;
    const arriendo = list.filter(
        (property) => property.operacion === "Arriendo"
    ).length;
    const destacadas = list.filter((property) => property.destacado).length;

    const recent = list.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
                        Resumen general
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0016A2] sm:text-4xl">
                        Dashboard
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Ten una visión rápida de tu inventario y entra directamente
                        a las tareas más importantes.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/gestion-valhalla/propiedades"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#79C2EF] hover:text-[#0016A2]"
                    >
                        Ver propiedades
                        <ArrowUpRight size={16} />
                    </Link>

                    <Link
                        href="/gestion-valhalla/nueva"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0016A2] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0016A2]/15 transition hover:-translate-y-0.5 hover:bg-[#0a28c4]"
                    >
                        <Plus size={17} />
                        Nueva propiedad
                    </Link>
                </div>
            </div>

            <Dashboard
                total={total}
                venta={venta}
                arriendo={arriendo}
                destacadas={destacadas}
                recent={recent}
            />
        </div>
    );
}
