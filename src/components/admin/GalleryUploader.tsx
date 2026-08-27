"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isImageUrl, storagePathFromPublicUrl } from "@/lib/media";

type GalleryItem = { id: string; url: string; orden?: number | null };
interface Props {
  propertyId: string;
  currentMainImage?: string;
  onMainImageChange?: (url: string) => void;
}

const MAX_SIZE_MB = 15;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function GalleryUploader({ propertyId, currentMainImage, onMainImageChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadGallery() {
    const supabase = createClient();
    const { data, error } = await supabase.from("imagenes_propiedad").select("id,url,orden").eq("propiedad_id", propertyId).order("orden", { ascending: true });
    if (error) { setError(error.message); return; }
    setItems((data ?? []).filter((item) => isImageUrl(item.url)));
  }

  useEffect(() => { void loadGallery(); }, [propertyId]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files);
    const invalid = selected.find((file) => !file.type.startsWith("image/") || !ALLOWED.includes(file.type) || file.size > MAX_SIZE_MB * 1024 * 1024);
    if (invalid) { setError("La galería solo acepta imágenes JPG, PNG, WebP, GIF o AVIF de hasta 15 MB. Los videos deben subirse en el campo Video."); return; }

    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];
      const baseOrder = items.length;
      for (const [index, file] of selected.entries()) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `galeria/${propertyId}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("propiedades").upload(path, file, { contentType: file.type, cacheControl: "3600" });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from("propiedades").getPublicUrl(path);
        const { error: insertError } = await supabase.from("imagenes_propiedad").insert({ propiedad_id: propertyId, url: publicData.publicUrl, orden: baseOrder + index + 1 });
        if (insertError) { await supabase.storage.from("propiedades").remove([path]); throw insertError; }
        uploadedUrls.push(publicData.publicUrl);
      }
      if (!currentMainImage && uploadedUrls[0]) onMainImageChange?.(uploadedUrls[0]);
      await loadGallery();
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir una o más imágenes.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(item: GalleryItem) {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusyId(item.id); setError("");
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("imagenes_propiedad").delete().eq("id", item.id);
      if (dbError) throw dbError;
      const path = storagePathFromPublicUrl(item.url);
      if (path) {
        const { error: storageError } = await supabase.storage.from("propiedades").remove([path]);
        if (storageError) console.warn("La referencia fue eliminada, pero no el archivo de Storage:", storageError);
      }
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (currentMainImage === item.url) onMainImageChange?.("");
    } catch (removeError) {
      console.error(removeError);
      setError(removeError instanceof Error ? removeError.message : "No fue posible eliminar la imagen.");
    } finally { setBusyId(null); }
  }

  async function move(itemId: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.id === itemId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const normalized = reordered.map((item, order) => ({ ...item, orden: order + 1 }));
    setItems(normalized); setBusyId(itemId); setError("");
    try {
      const supabase = createClient();
      const results = await Promise.all(normalized.map((item) => supabase.from("imagenes_propiedad").update({ orden: item.orden }).eq("id", item.id)));
      const failed = results.find((result) => result.error);
      if (failed?.error) throw failed.error;
    } catch (moveError) {
      console.error(moveError); setError(moveError instanceof Error ? moveError.message : "No fue posible cambiar el orden."); await loadGallery();
    } finally { setBusyId(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-black text-[#0016A2]">Galería de imágenes</p><p className="mt-1 text-xs text-slate-500">Elige la portada, cambia el orden y elimina cada fotografía de forma individual.</p></div>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#0016A2]/15 px-4 py-2.5 text-sm font-bold text-[#0016A2] transition hover:bg-[#F3F7FC] disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}{loading ? "Subiendo..." : "Agregar imágenes"}</button>
      </div>
      <input ref={inputRef} type="file" hidden multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => upload(e.target.files)} />
      {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">{error}</p>}
      {items.length > 0 && <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((item, index) => {
        const isMain = currentMainImage === item.url;
        return <div key={item.id} className={`overflow-hidden rounded-xl border bg-slate-50 ${isMain ? "border-[#0016A2] ring-2 ring-[#79C2EF]/30" : "border-slate-200"}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><img src={item.url} alt={`Imagen ${index + 1} de la galería`} className="h-full w-full object-cover" />{isMain && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#0016A2] px-2.5 py-1 text-[10px] font-black text-white"><Star size={12} fill="currentColor" />Principal</span>}</div>
          <div className="flex items-center justify-between gap-2 p-2">
            <button type="button" onClick={() => onMainImageChange?.(item.url)} disabled={busyId !== null} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold ${isMain ? "bg-[#0016A2] text-white" : "bg-white text-[#0016A2] hover:bg-[#F3F7FC]"}`}><Star size={14} />{isMain ? "Principal" : "Hacer principal"}</button>
            <div className="flex items-center gap-1"><button type="button" aria-label="Mover a la izquierda" disabled={index === 0 || busyId !== null} onClick={() => move(item.id, -1)} className="rounded-lg p-2 text-slate-500 hover:bg-white disabled:opacity-30"><ArrowLeft size={16} /></button><button type="button" aria-label="Mover a la derecha" disabled={index === items.length - 1 || busyId !== null} onClick={() => move(item.id, 1)} className="rounded-lg p-2 text-slate-500 hover:bg-white disabled:opacity-30"><ArrowRight size={16} /></button><button type="button" aria-label="Eliminar imagen" disabled={busyId !== null} onClick={() => remove(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-30">{busyId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button></div>
          </div>
        </div>;
      })}</div>}
      {!loading && items.length === 0 && <p className="mt-5 rounded-xl bg-[#F3F7FC] px-4 py-4 text-sm text-slate-500">Todavía no hay imágenes adicionales en la galería.</p>}
      {currentMainImage && <p className="mt-4 text-xs font-medium text-slate-500">La selección de imagen principal se guardará al pulsar <strong>Actualizar propiedad</strong>.</p>}
    </div>
  );
}
