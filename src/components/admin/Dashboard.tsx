import Link from "next/link";
import { isImageUrl } from "@/lib/media";
import {
    ArrowUpRight,
    Building2,
    Home,
    KeyRound,
    Star,
} from "lucide-react";

interface DashboardProps {
    total: number;
    venta: number;
    arriendo: number;
    destacadas: number;
    recent: Array<{
        id: string;
        titulo: string;
        ciudad: string;
        precio: number;
        operacion: string;
        estado: string;
        imagen_principal: string | null;
    }>;
}

export default function Dashboard({
    total,
    venta,
    arriendo,
    destacadas,
    recent,
}: DashboardProps) {
    const cards = [
        {
            label: "Propiedades",
            value: total,
            icon: Building2,
            tone: "bg-[#0016A2] text-white",
        },
        {
            label: "En venta",
            value: venta,
            icon: Home,
            tone: "bg-[#79C2EF]/20 text-[#0016A2]",
        },
        {
            label: "En arriendo",
            value: arriendo,
            icon: KeyRound,
            tone: "bg-white text-[#0016A2] border border-slate-200",
        },
        {
            label: "Destacadas",
            value: destacadas,
            icon: Star,
            tone: "bg-[#0016A2]/5 text-[#0016A2]",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className={`rounded-[1.5rem] p-5 shadow-[0_14px_45px_rgba(0,22,162,0.06)] ${card.tone}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                        {card.label}
                                    </p>
                                    <p className="mt-3 text-4xl font-black tracking-tight">
                                        {card.value}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                    <Icon size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(0,22,162,0.06)]">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
                            Actividad
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-[#0016A2]">
                            Propiedades recientes
                        </h2>
                    </div>

                    <Link
                        href="/gestion-valhalla/propiedades"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0016A2] hover:text-[#0a28c4]"
                    >
                        Ver inventario
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <div className="px-6 py-16 text-center text-sm text-slate-500">
                        Todavía no hay propiedades registradas.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {recent.map((property) => (
                            <Link
                                key={property.id}
                                href={`/gestion-valhalla/editar/${property.id}`}
                                className="grid gap-4 p-5 transition hover:bg-[#F3F7FC]/70 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:p-6"
                            >
                                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                    {isImageUrl(property.imagen_principal) ? (
                                        <img
                                            src={property.imagen_principal}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400">
                                            <Building2 size={22} />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-wide text-[#0016A2]">
                                            {property.operacion}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">
                                            {property.estado}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm font-black text-slate-800">
                                        {property.titulo}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {property.ciudad}
                                    </p>
                                </div>

                                <p className="text-sm font-black text-[#0016A2]">
                                    ${Number(property.precio || 0).toLocaleString("es-CO")}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
