"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Check,
    FileText,
    Images,
    MapPinned,
    Save,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import VideoUploader from "./VideoUploader";
import { isImageUrl } from "@/lib/media";

interface PropertyFormProps {
    mode?: "create" | "edit";
    initialData?: {
        id?: string;
        titulo: string;
        codigo?: string;
        tipo: string;
        operacion: string;
        estado?: string;
        ciudad: string;
        barrio?: string;
        direccion?: string;
        precio: number;
        administracion?: number;
        habitaciones: number;
        banos: number;
        parqueaderos?: number;
        area: number;
        estrato?: number;
        descripcion: string;
        imagen_principal?: string;
        video?: string;
        mapa?: string;
        destacado?: boolean;
        publicado?: boolean;
    };
}

const initialForm = {
    titulo: "",
    codigo: "",
    tipo: "Casa",
    operacion: "Venta",
    estado: "Disponible",
    ciudad: "",
    barrio: "",
    direccion: "",
    precio: "",
    administracion: "",
    habitaciones: "",
    banos: "",
    parqueaderos: "",
    area: "",
    estrato: "",
    descripcion: "",
    imagen_principal: "",
    video: "",
    mapa: "",
    destacado: false,
    publicado: true,
};

function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </span>
            {children}
            {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
        </label>
    );
}

const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#79C2EF] focus:ring-4 focus:ring-[#79C2EF]/15";

export default function PropertyForm({
    mode = "create",
    initialData,
}: PropertyFormProps) {
    const router = useRouter();

    const [form, setForm] = useState(() => ({
        titulo: initialData?.titulo ?? initialForm.titulo,
        codigo: initialData?.codigo ?? initialForm.codigo,
        tipo: initialData?.tipo ?? initialForm.tipo,
        operacion: initialData?.operacion ?? initialForm.operacion,
        estado: initialData?.estado ?? initialForm.estado,
        ciudad: initialData?.ciudad ?? initialForm.ciudad,
        barrio: initialData?.barrio ?? initialForm.barrio,
        direccion: initialData?.direccion ?? initialForm.direccion,
        precio: initialData?.precio?.toString() ?? initialForm.precio,
        administracion:
            initialData?.administracion?.toString() ?? initialForm.administracion,
        habitaciones:
            initialData?.habitaciones?.toString() ?? initialForm.habitaciones,
        banos: initialData?.banos?.toString() ?? initialForm.banos,
        parqueaderos:
            initialData?.parqueaderos?.toString() ?? initialForm.parqueaderos,
        area: initialData?.area?.toString() ?? initialForm.area,
        estrato: initialData?.estrato?.toString() ?? initialForm.estrato,
        descripcion: initialData?.descripcion ?? initialForm.descripcion,
        imagen_principal:
            initialData?.imagen_principal ?? initialForm.imagen_principal,
        video: initialData?.video ?? initialForm.video,
        mapa: initialData?.mapa ?? initialForm.mapa,
        destacado: initialData?.destacado ?? initialForm.destacado,
        publicado: initialData?.publicado ?? initialForm.publicado,
    }));

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function update<K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    async function guardar() {
        setError("");

        if (!form.titulo.trim() || !form.ciudad.trim() || !form.precio) {
            setError("Completa al menos título, ciudad y precio antes de guardar.");
            return;
        }

        setSaving(true);

        const body = {
            id: initialData?.id,
            titulo: form.titulo.trim(),
            codigo: form.codigo.trim(),
            tipo: form.tipo,
            operacion: form.operacion,
            estado: form.estado,
            ciudad: form.ciudad.trim(),
            barrio: form.barrio.trim(),
            direccion: form.direccion.trim(),
            precio: Number(form.precio),
            administracion: Number(form.administracion || 0),
            habitaciones: Number(form.habitaciones || 0),
            banos: Number(form.banos || 0),
            parqueaderos: Number(form.parqueaderos || 0),
            area: Number(form.area || 0),
            estrato: Number(form.estrato || 0),
            descripcion: form.descripcion,
            imagen_principal: form.imagen_principal,
            video: form.video,
            mapa: form.mapa,
            publicado: form.publicado,
            destacado: form.destacado,
        };

        try {
            const response = await fetch("/api/propiedades", {
                method: mode === "create" ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message || "No fue posible guardar la propiedad."
                );
            }

            const savedId = result?.data?.id as string | undefined;
            if (mode === "create" && savedId) {
                router.push(`/gestion-valhalla/editar/${savedId}`);
            } else {
                router.push("/gestion-valhalla/propiedades");
            }
            router.refresh();
        } catch (saveError) {
            console.error(saveError);
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "No fue posible guardar la propiedad."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(0,22,162,0.06)]">
            <div className="border-b border-slate-100 bg-[#F3F7FC]/70 p-5 sm:p-7">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0016A2] text-white">
                        <FileText size={19} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#79C2EF]">
                            Información inmobiliaria
                        </p>
                        <h2 className="mt-1 text-xl font-black text-[#0016A2]">
                            {mode === "create"
                                ? "Crear publicación"
                                : "Actualizar publicación"}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="space-y-8 p-5 sm:p-7">
                <section>
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-xs font-black text-[#0016A2]">
                            01
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">
                                Información general
                            </h3>
                            <p className="text-xs text-slate-400">
                                Identificación y estado de la propiedad.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label="Título">
                            <input
                                className={inputClass}
                                value={form.titulo}
                                onChange={(event) =>
                                    update("titulo", event.target.value)
                                }
                                placeholder="Ej. Casa en Villa María"
                            />
                        </Field>

                        <Field label="Código" hint="Referencia interna de la propiedad.">
                            <input
                                className={inputClass}
                                value={form.codigo}
                                onChange={(event) =>
                                    update("codigo", event.target.value)
                                }
                                placeholder="Ej. VH-001"
                            />
                        </Field>

                        <Field label="Tipo de inmueble">
                            <select
                                className={inputClass}
                                value={form.tipo}
                                onChange={(event) =>
                                    update("tipo", event.target.value)
                                }
                            >
                                <option>Casa</option>
                                <option>Apartamento</option>
                                <option>Lote</option>
                                <option>Local</option>
                                <option>Oficina</option>
                                <option>Bodega</option>
                                <option>Finca</option>
                                <option>Consultorio</option>
                                <option>Edificio</option>
                            </select>
                        </Field>

                        <Field label="Operación">
                            <select
                                className={inputClass}
                                value={form.operacion}
                                onChange={(event) =>
                                    update("operacion", event.target.value)
                                }
                            >
                                <option>Venta</option>
                                <option>Arriendo</option>
                                <option>Venta y Arriendo</option>
                            </select>
                        </Field>

                        <Field label="Estado">
                            <select
                                className={inputClass}
                                value={form.estado}
                                onChange={(event) =>
                                    update("estado", event.target.value)
                                }
                            >
                                <option>Disponible</option>
                                <option>Reservado</option>
                                <option>Vendido</option>
                                <option>Arrendado</option>
                            </select>
                        </Field>
                    </div>
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-xs font-black text-[#0016A2]">
                            02
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">Ubicación</h3>
                            <p className="text-xs text-slate-400">
                                Información geográfica visible para los clientes.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label="Ciudad">
                            <input
                                className={inputClass}
                                value={form.ciudad}
                                onChange={(event) =>
                                    update("ciudad", event.target.value)
                                }
                                placeholder="Ciudad"
                            />
                        </Field>

                        <Field label="Barrio">
                            <input
                                className={inputClass}
                                value={form.barrio}
                                onChange={(event) =>
                                    update("barrio", event.target.value)
                                }
                                placeholder="Barrio"
                            />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="Dirección">
                                <input
                                    className={inputClass}
                                    value={form.direccion}
                                    onChange={(event) =>
                                        update("direccion", event.target.value)
                                    }
                                    placeholder="Dirección"
                                />
                            </Field>
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-xs font-black text-[#0016A2]">
                            03
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">Valores y características</h3>
                            <p className="text-xs text-slate-400">
                                Datos que aparecerán en las tarjetas y ficha del inmueble.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Precio">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.precio}
                                onChange={(event) =>
                                    update("precio", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Administración">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.administracion}
                                onChange={(event) =>
                                    update("administracion", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Área (m²)">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.area}
                                onChange={(event) =>
                                    update("area", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Habitaciones">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.habitaciones}
                                onChange={(event) =>
                                    update("habitaciones", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Baños">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.banos}
                                onChange={(event) =>
                                    update("banos", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Parqueaderos">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.parqueaderos}
                                onChange={(event) =>
                                    update("parqueaderos", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>

                        <Field label="Estrato">
                            <input
                                type="number"
                                min="0"
                                className={inputClass}
                                value={form.estrato}
                                onChange={(event) =>
                                    update("estrato", event.target.value)
                                }
                                placeholder="0"
                            />
                        </Field>
                    </div>
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-xs font-black text-[#0016A2]">
                            04
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">Descripción</h3>
                            <p className="text-xs text-slate-400">
                                Presenta el inmueble de forma clara y profesional.
                            </p>
                        </div>
                    </div>

                    <textarea
                        rows={8}
                        className={`${inputClass} h-auto py-4`}
                        value={form.descripcion}
                        onChange={(event) =>
                            update("descripcion", event.target.value)
                        }
                        placeholder="Describe las características y condiciones de la propiedad..."
                    />
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-xs font-black text-[#0016A2]">
                            05
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">Multimedia</h3>
                            <p className="text-xs text-slate-400">
                                La imagen principal, galería y video se manejan por separado.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-[#F3F7FC]/60 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#79C2EF]/20 text-[#0016A2]">
                                    <Images size={18} />
                                </div>
                                <div>
                                    <p className="font-black text-[#0016A2]">
                                        Imagen principal
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Portada del inmueble.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <ImageUploader
                                    hasImage={!!form.imagen_principal}
                                    onUpload={(url) =>
                                        update("imagen_principal", url)
                                    }
                                />
                            </div>

                            {isImageUrl(form.imagen_principal) && (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <img
                                        src={form.imagen_principal}
                                        alt="Vista previa de la imagen principal"
                                        className="h-56 w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            <VideoUploader
                                currentUrl={form.video}
                                onUpload={(url) => update("video", url)}
                                onRemove={() => update("video", "")}
                            />

                            <div className="rounded-2xl border border-slate-200 bg-[#F3F7FC]/60 p-5">
                                <p className="text-sm font-black text-[#0016A2]">
                                    Video externo
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    También puedes conservar una URL de YouTube.
                                </p>
                                <input
                                    className={`${inputClass} mt-4`}
                                    value={form.video}
                                    onChange={(event) => update("video", event.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Se admiten enlaces youtube.com, youtu.be, Shorts y enlaces /embed. Al pegar un enlace válido aparecerá la vista previa arriba.
                                </p>
                            </div>
                        </div>
                    </div>

                    {mode === "edit" && initialData?.id ? (
                        <div className="mt-5">
                            <GalleryUploader
                                propertyId={initialData.id}
                                currentMainImage={form.imagen_principal}
                                onMainImageChange={(url) => update("imagen_principal", url)}
                            />
                        </div>
                    ) : (
                        <p className="mt-5 rounded-xl bg-[#F3F7FC] px-4 py-3 text-sm text-slate-500">
                            Guarda primero la propiedad. Después podrás agregar y administrar todas las imágenes de la galería.
                        </p>
                    )}
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#79C2EF]/20 text-[#0016A2]">
                            <MapPinned size={16} />
                        </span>
                        <div>
                            <h3 className="font-black text-[#0016A2]">Ubicación en mapa</h3>
                            <p className="text-xs text-slate-400">
                                Puedes pegar la URL de inserción de Google Maps.
                            </p>
                        </div>
                    </div>

                    <input
                        className={inputClass}
                        value={form.mapa}
                        onChange={(event) => update("mapa", event.target.value)}
                        placeholder="https://www.google.com/maps/embed?..."
                    />
                </section>

                <section className="border-t border-slate-100 pt-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => update("publicado", !form.publicado)}
                            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                                form.publicado
                                    ? "border-[#79C2EF] bg-[#79C2EF]/10"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <div>
                                <p className="text-sm font-black text-[#0016A2]">
                                    Publicar propiedad
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Visible en el catálogo público.
                                </p>
                            </div>
                            <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                    form.publicado
                                        ? "bg-[#0016A2] text-white"
                                        : "bg-slate-100 text-slate-300"
                                }`}
                            >
                                <Check size={15} />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => update("destacado", !form.destacado)}
                            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                                form.destacado
                                    ? "border-[#79C2EF] bg-[#79C2EF]/10"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <div>
                                <p className="text-sm font-black text-[#0016A2]">
                                    Marcar como destacada
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Prioriza el inmueble en secciones destacadas.
                                </p>
                            </div>
                            <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                    form.destacado
                                        ? "bg-[#0016A2] text-white"
                                        : "bg-slate-100 text-slate-300"
                                }`}
                            >
                                <Check size={15} />
                            </span>
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/gestion-valhalla/propiedades")
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-[#0016A2]"
                    >
                        <ArrowLeft size={17} />
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={guardar}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0016A2]/15 transition hover:-translate-y-0.5 hover:bg-[#0a28c4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={17} />
                        {saving
                            ? "Guardando..."
                            : mode === "create"
                              ? "Guardar propiedad"
                              : "Actualizar propiedad"}
                    </button>
                </div>
            </div>
        </div>
    );
}
