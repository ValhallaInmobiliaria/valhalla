"use client";
import { isImageUrl } from "@/lib/media";


import Link from "next/link";
import {
    Building2,
    Eye,
    Pencil,
    Search,
    Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Propiedad } from "@/types/propiedad";

function formatPrice(value: number) {
    return `$${Number(value || 0).toLocaleString("es-CO")}`;
}

export default function PropertyList({
    properties,
}: {
    properties: Propiedad[];
}) {
    const [query, setQuery] = useState("");
    const [operation, setOperation] = useState("Todas");
    const [status, setStatus] = useState("Todos");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return properties.filter((property) => {
            const matchesQuery =
                !normalized ||
                [
                    property.titulo,
                    property.codigo,
                    property.ciudad,
                    property.tipo,
                    property.operacion,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(normalized)
                    );

            const matchesOperation =
                operation === "Todas" || property.operacion === operation;

            const matchesStatus =
                status === "Todos" || property.estado === status;

            return matchesQuery && matchesOperation && matchesStatus;
        });
    }, [properties, query, operation, status]);

    async function deleteProperty(id: string, title: string) {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar "${title}"? Esta acción no se puede deshacer.`
        );

        if (!confirmed) return;

        setDeletingId(id);

        try {
            const response = await fetch("/api/propiedades", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message || "No fue posible eliminar.");
            }

            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("No fue posible eliminar la propiedad.");
            setDeletingId(null);
        }
    }

    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(0,22,162,0.06)]">
            <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
                            Inventario
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0016A2]">
                            Propiedades registradas
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {filtered.length} de {properties.length} propiedades
                            visibles.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="relative block">
                            <Search
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Buscar propiedad..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-[#F3F7FC] pl-10 pr-4 text-sm outline-none transition focus:border-[#79C2EF] focus:bg-white focus:ring-4 focus:ring-[#79C2EF]/15 sm:w-64"
                            />
                        </label>

                        <select
                            value={operation}
                            onChange={(event) =>
                                setOperation(event.target.value)
                            }
                            className="h-11 rounded-xl border border-slate-200 bg-[#F3F7FC] px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#79C2EF]"
                        >
                            <option>Todas</option>
                            <option>Venta</option>
                            <option>Arriendo</option>
                            <option>Venta y Arriendo</option>
                        </select>

                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-[#F3F7FC] px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#79C2EF]"
                        >
                            <option>Todos</option>
                            <option>Disponible</option>
                            <option>Reservado</option>
                            <option>Vendido</option>
                            <option>Arrendado</option>
                        </select>
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#79C2EF]/15 text-[#0016A2]">
                        <Building2 size={28} />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-[#0016A2]">
                        No encontramos propiedades
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Prueba con otro término o cambia los filtros.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {filtered.map((property) => (
                        <article
                            key={property.id}
                            className="p-5 transition hover:bg-[#F3F7FC]/70 sm:p-6"
                        >
                            <div className="grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)_auto] lg:items-center">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                                    {isImageUrl(property.imagen_principal) ? (
                                        <img
                                            src={property.imagen_principal}
                                            alt={property.titulo}
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-400">
                                            <Building2 size={30} />
                                        </div>
                                    )}

                                    <span className="absolute left-3 top-3 rounded-full bg-[#0016A2] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                                        {property.operacion}
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                                            {property.estado}
                                        </span>
                                        {property.destacado && (
                                            <span className="rounded-full bg-[#79C2EF]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#0016A2]">
                                                Destacada
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-2 truncate text-xl font-black text-[#0016A2]">
                                        {property.titulo}
                                    </h3>

                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {property.ciudad}
                                        {property.direccion
                                            ? ` · ${property.direccion}`
                                            : ""}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                                        <span>{property.tipo}</span>
                                        <span>{property.area} m²</span>
                                        <span>{property.habitaciones} hab.</span>
                                        <span>{property.banos} baños</span>
                                    </div>

                                    <p className="mt-4 text-lg font-black text-[#0016A2]">
                                        {formatPrice(property.precio)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 lg:flex-col">
                                    <Link
                                        href={`/propiedades/${property.id}`}
                                        target="_blank"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#79C2EF] hover:text-[#0016A2]"
                                    >
                                        <Eye size={15} />
                                        Ver
                                    </Link>

                                    <Link
                                        href={`/gestion-valhalla/editar/${property.id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0a28c4]"
                                    >
                                        <Pencil size={15} />
                                        Editar
                                    </Link>

                                    <button
                                        type="button"
                                        disabled={deletingId === property.id}
                                        onClick={() =>
                                            deleteProperty(
                                                property.id,
                                                property.titulo
                                            )
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                    >
                                        <Trash2 size={15} />
                                        {deletingId === property.id
                                            ? "Eliminando..."
                                            : "Eliminar"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
