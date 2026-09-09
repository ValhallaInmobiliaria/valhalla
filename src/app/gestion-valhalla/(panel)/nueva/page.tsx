import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropertyForm from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

export default function NuevaPropiedadPage() {
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
                    Nueva propiedad
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Completa la información del inmueble y guarda la publicación.
                </p>
            </div>

            <PropertyForm />
        </div>
    );
}
