"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Megaphone,
  Send,
  X,
} from "lucide-react";
import { isImageUrl } from "@/lib/media";
import type { Propiedad } from "@/types/propiedad";

function formatPrice(value: number) {
  return `$${Number(value || 0).toLocaleString("es-CO")}`;
}

function buildDefaultMessage(property: Propiedad) {
  const lines = [
    `🏠 ${property.titulo}`,
    "",
    `📍 ${property.ciudad}${property.barrio ? ` · ${property.barrio}` : ""}`,
    `💰 ${formatPrice(property.precio)}`,
    `📐 ${property.area} m² · 🛏️ ${property.habitaciones} hab. · 🚿 ${property.banos} baños${property.parqueaderos ? ` · 🚗 ${property.parqueaderos} parqueadero${property.parqueaderos === 1 ? "" : "s"}` : ""}`,
    "",
    property.operacion === "Arriendo"
      ? "Una excelente opción para vivir en un espacio cómodo y bien ubicado."
      : "Una excelente oportunidad para invertir o encontrar tu próximo hogar.",
    "",
    "📲 Contáctanos y agenda tu visita.",
    "Valhalla Inmobiliaria",
  ];

  return lines.join("\n");
}

type PublishResult = {
  success: boolean;
  message?: string;
  detail?: string;
  postId?: string | null;
  facebookUrl?: string | null;
};

export default function FacebookPublisher({
  property,
  onClose,
}: {
  property: Propiedad;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(() => buildDefaultMessage(property));
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublishResult | null>(null);

  const propertyUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/propiedades/${property.id}`;
    }

    return `${window.location.origin}/propiedades/${property.id}`;
  }, [property.id]);

  async function publish() {
    setPublishing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/facebook/publicar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          message,
        }),
      });

      const body = (await response.json().catch(() => null)) as PublishResult | null;

      if (!response.ok || !body?.success) {
        const detail = body?.detail ? ` ${body.detail}` : "";
        throw new Error(`${body?.message || "No fue posible publicar."}${detail}`);
      }

      setResult(body);
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "No fue posible publicar en Facebook."
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facebook-publisher-title"
    >
      <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-[#F3F7FC] shadow-2xl sm:max-h-[92vh] sm:rounded-[2rem]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#79C2EF]">
              Redes sociales
            </p>
            <h2
              id="facebook-publisher-title"
              className="mt-1 text-xl font-black text-[#0016A2] sm:text-2xl"
            >
              Preparar publicación en Facebook
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={publishing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
          <div className="space-y-5">
            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0016A2] text-white">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#0016A2]">Texto de la publicación</h3>
                  <p className="text-xs text-slate-500">
                    Puedes editarlo antes de enviarlo a la página de Valhalla.
                  </p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={12}
                maxLength={5000}
                disabled={publishing || Boolean(result?.success)}
                className="mt-5 w-full resize-y rounded-2xl border border-slate-200 bg-[#F8FAFD] p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#79C2EF] focus:bg-white focus:ring-4 focus:ring-[#79C2EF]/15 disabled:opacity-70"
              />

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>El enlace de la propiedad se agrega automáticamente.</span>
                <span>{message.length}/5000</span>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                <strong>No se pudo publicar.</strong> {error}
              </div>
            )}

            {result?.success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
                  <div>
                    <h3 className="font-black text-emerald-800">Publicación enviada</h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      La propiedad fue publicada en la página de Facebook configurada.
                    </p>
                    {result.facebookUrl && (
                      <a
                        href={result.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 underline underline-offset-4"
                      >
                        Abrir publicación
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside>
            <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Vista previa
                </p>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  Así se prepara la propiedad para Facebook
                </p>
              </div>

              {isImageUrl(property.imagen_principal) ? (
                <div className="aspect-[4/3] bg-slate-100">
                  <img
                    src={property.imagen_principal!}
                    alt={property.titulo}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
                  Sin imagen principal
                </div>
              )}

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0016A2] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                    {property.operacion}
                  </span>
                  {property.codigo && (
                    <span className="rounded-full bg-[#79C2EF]/20 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#0016A2]">
                      Cód. {property.codigo}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-xl font-black leading-tight text-[#0016A2]">
                  {property.titulo}
                </h3>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} />
                  {property.ciudad}
                  {property.barrio ? ` · ${property.barrio}` : ""}
                </p>

                <p className="mt-4 text-2xl font-black text-[#0016A2]">
                  {formatPrice(property.precio)}
                </p>

                <a
                  href={propertyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-between rounded-xl bg-[#F3F7FC] px-4 py-3 text-xs font-bold text-[#0016A2]"
                >
                  Ver propiedad en el sitio
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            disabled={publishing}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {result?.success ? "Cerrar" : "Cancelar"}
          </button>

          {!result?.success && (
            <button
              type="button"
              onClick={publish}
              disabled={publishing || !message.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#0016A2]/20 transition hover:-translate-y-0.5 hover:bg-[#0a28c4] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {publishing ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}
              {publishing ? "Publicando..." : "Publicar en Facebook"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
