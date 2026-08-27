import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditarPropiedadPage({ params }: Props) {
    await requireAdmin();

    const { id } = await params;

    const { data: property } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single();

    if (!property) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <Link
                href="/gestion-valhalla/propiedades"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0016A2]"
            >
                <ArrowLeft size={16} />
                Volver a propiedades
            </Link>

            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
                    Inventario
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0016A2] sm:text-4xl">
                    Editar propiedad
                </h1>
                <p className="mt-2 truncate text-sm text-slate-500">
                    {property.titulo}
                </p>
            </div>

            <PropertyForm mode="edit" initialData={property} />
        </div>
    );
}
