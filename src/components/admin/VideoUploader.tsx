"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Film, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getYouTubeEmbedUrl, isDirectVideoUrl } from "@/lib/media";

interface Props {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
}

export default function VideoUploader({ onUpload, onRemove, currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function uploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    if (!file.type.startsWith("video/")) {
      setError("Selecciona un archivo de video válido.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `videos/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("propiedades")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("propiedades").getPublicUrl(path);
      onUpload(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "No fue posible subir el video. Revisa el bucket y sus permisos en Supabase.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const youtubeEmbed = getYouTubeEmbedUrl(currentUrl);
  const directVideo = isDirectVideoUrl(currentUrl);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#79C2EF]/20 text-[#0016A2]"><Film size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-[#0016A2]">Video de la propiedad</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Sube un video sin límite artificial en la aplicación. El límite real lo define la configuración del bucket de Supabase. El archivo se guarda fuera de la galería.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#0016A2] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0a28c4] disabled:cursor-not-allowed disabled:opacity-60">
              <UploadCloud size={17} />{loading ? "Subiendo video..." : currentUrl ? "Cambiar video" : "Subir video"}
            </button>
            {currentUrl && onRemove && <button type="button" onClick={onRemove} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"><Trash2 size={16} />Quitar video</button>}
          </div>

          <input ref={inputRef} type="file" hidden accept="video/*" onChange={uploadVideo} />

          {currentUrl && !loading && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 aspect-video">
              {directVideo ? <video src={currentUrl} controls preload="metadata" className="h-full w-full object-contain" /> : youtubeEmbed ? <iframe src={youtubeEmbed} title="Vista previa del video de YouTube" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/80">La URL actual no es un video directo ni un enlace válido de YouTube.</div>}
            </div>
          )}

          {currentUrl && !loading && <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} />Video listo para guardarse en la propiedad.</div>}
          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
