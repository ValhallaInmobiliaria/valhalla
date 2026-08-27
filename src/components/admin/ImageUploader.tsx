"use client";

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  onUpload: (url: string) => void;
  hasImage?: boolean;
}

const MAX_SIZE_MB = 15;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function ImageUploader({ onUpload, hasImage = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/") || !ALLOWED.includes(file.type)) {
      setError("Selecciona una imagen JPG, PNG, WebP, GIF o AVIF. Los videos no se permiten aquí.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede superar ${MAX_SIZE_MB} MB.`);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `imagenes/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("propiedades").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("propiedades").getPublicUrl(path);
      onUpload(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);
      setError("No fue posible subir la imagen. Revisa el bucket y sus permisos en Supabase.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-[#0016A2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0a28c4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <UploadCloud size={17} /> : <ImagePlus size={17} />}
        {loading ? "Subiendo imagen..." : hasImage ? "Cambiar imagen" : "Subir imagen"}
      </button>
      <input ref={inputRef} type="file" hidden accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={uploadImage} />
      {error && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
