import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CarFront,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PhotoGallery from "@/components/gallery/PhotoGallery";
import { supabase } from "@/lib/supabase";
import { SITE, buildWhatsAppUrl } from "@/lib/site";
import { getYouTubeEmbedUrl, imageUrls, isDirectVideoUrl, isImageUrl } from "@/lib/media";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const { data: property } = await supabase
    .from("propiedades")
    .select("titulo, ciudad, operacion, descripcion")
    .eq("id", id)
    .single();

  if (!property) {
    return {
      title: "Propiedad no encontrada",
    };
  }

  return {
    title: property.titulo || "Propiedad",
    description:
      property.descripcion ||
      `${property.operacion || "Propiedad"} en ${property.ciudad || "Colombia"}.`,
  };
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;

  const { data: property, error: propertyError } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();

  if (propertyError || !property) {
    notFound();
  }

  const { data: images } = await supabase
    .from("imagenes_propiedad")
    .select("*")
    .eq("propiedad_id", id)
    .order("orden");

  const whatsappUrl = buildWhatsAppUrl(
    `Hola, estoy interesado(a) en la propiedad "${property.titulo}"${
      property.codigo ? `, código ${property.codigo}` : ""
    }. Me gustaría recibir más información y conocer la disponibilidad para una visita.`
  );

  const phoneUrl = `tel:+${SITE.whatsappNumber}`;
  const precio = Number(property.precio || 0);
  const administracion = Number(property.administracion || 0);

  const propertyImages = [
    ...(isImageUrl(property.imagen_principal)
      ? [{ id: "principal", url: property.imagen_principal }]
      : []),
    ...imageUrls(images ?? []),
  ].filter((image, index, all) => all.findIndex((candidate) => candidate.url === image.url) === index);

  const features = [
    {
      icon: <BedDouble size={18} />,
      label: "Habitaciones",
      value: property.habitaciones ?? 0,
    },
    {
      icon: <Bath size={18} />,
      label: "Baños",
      value: property.banos ?? 0,
    },
    {
      icon: <CarFront size={18} />,
      label: "Parqueaderos",
      value: property.parqueaderos ?? 0,
    },
    {
      icon: <Ruler size={18} />,
      label: "Área",
      value: `${property.area ?? 0} m²`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F3F7FC] text-slate-800">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0016A2] transition hover:text-[#79C2EF]"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </Link>
        </div>
      </section>

      <section className="bg-[#F3F7FC]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,0.7fr)] xl:gap-10">
            <div className="min-w-0">
              <PhotoGallery images={propertyImages} />
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,22,162,0.08)] sm:p-8 xl:sticky xl:top-[112px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-[#0016A2] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white">
                  {property.operacion || "Propiedad"}
                </span>

                {property.estado && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#79C2EF]/20 px-3 py-1.5 text-xs font-bold text-[#0016A2]">
                    <CheckCircle2 size={13} />
                    {property.estado}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-3xl font-black leading-[1.08] tracking-tight text-[#0016A2] sm:text-4xl">
                {property.titulo || "Propiedad disponible"}
              </h1>

              <div className="mt-4 flex items-start gap-2 text-slate-500">
                <MapPin className="mt-0.5 shrink-0 text-[#79C2EF]" size={19} />
                <p className="text-sm font-medium leading-6 sm:text-base">
                  {property.ciudad || "Colombia"}
                  {property.barrio ? ` • ${property.barrio}` : ""}
                </p>
              </div>

              <div className="mt-7 rounded-2xl border border-[#79C2EF]/40 bg-[#F3F7FC] px-5 py-5">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                  Precio
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight text-[#0016A2] sm:text-4xl">
                  ${precio.toLocaleString("es-CO")}
                </p>

                {administracion > 0 && (
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Administración: $
                    {administracion.toLocaleString("es-CO")}
                  </p>
                )}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0016A2] px-5 py-4 text-base font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2] hover:shadow-lg"
              >
                <MessageCircle size={19} />
                Consultar por WhatsApp
              </a>

              <a
                href={phoneUrl}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0016A2]/15 px-5 py-3.5 text-sm font-bold text-[#0016A2] transition hover:border-[#79C2EF] hover:bg-[#79C2EF]/10"
              >
                <Phone size={17} />
                Llamar a Valhalla
              </a>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <Feature
                    key={feature.label}
                    icon={feature.icon}
                    label={feature.label}
                    value={feature.value}
                  />
                ))}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                {property.codigo && (
                  <InfoRow label="Código" value={property.codigo} />
                )}
                {property.tipo && (
                  <InfoRow label="Tipo" value={property.tipo} />
                )}
                {property.estrato != null && (
                  <InfoRow label="Estrato" value={property.estrato} />
                )}
                {property.direccion && (
                  <InfoRow label="Dirección" value={property.direccion} />
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#F3F7FC] pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <SectionTitle>Descripción</SectionTitle>
              <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {property.descripcion ||
                  "Esta propiedad no tiene una descripción disponible actualmente."}
              </div>
            </article>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <SectionTitle>Información</SectionTitle>
              <div className="mt-6 space-y-4">
                <InfoRow
                  label="Operación"
                  value={property.operacion || "-"}
                />
                <InfoRow label="Tipo" value={property.tipo || "-"} />
                <InfoRow label="Ciudad" value={property.ciudad || "-"} />
                {property.barrio && (
                  <InfoRow label="Barrio" value={property.barrio} />
                )}
                <InfoRow
                  label="Área"
                  value={`${property.area ?? 0} m²`}
                />
                {administracion > 0 && (
                  <InfoRow
                    label="Administración"
                    value={`$${administracion.toLocaleString("es-CO")}`}
                  />
                )}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#79C2EF] hover:text-[#0016A2]"
              >
                <MessageCircle size={18} />
                Me interesa esta propiedad
              </a>
            </aside>
          </div>

          {(property.video || property.mapa) && (
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {property.video && (
                <MediaCard title="Video de la propiedad">
                  {isDirectVideoUrl(property.video) ? (
                    <video
                      src={property.video}
                      controls
                      preload="metadata"
                      className="h-full w-full object-contain bg-black"
                    >
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  ) : (
                    <iframe
                      src={getYouTubeEmbedUrl(property.video) ?? property.video}
                      title="Video de la propiedad"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </MediaCard>
              )}

              {property.mapa && (
                <MediaCard title="Ubicación">
                  <iframe
                    src={property.mapa}
                    title="Mapa de ubicación"
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </MediaCard>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0016A2]">
            {SITE.name}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0016A2] sm:text-4xl">
            ¿Te interesa esta propiedad?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Comunícate con nosotros para conocer más detalles, resolver tus
            dudas o agendar una visita.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-7 py-3.5 font-extrabold text-white shadow-sm transition hover:bg-[#79C2EF] hover:text-[#0016A2]"
            >
              <MessageCircle size={18} />
              Escribir por WhatsApp
            </a>

            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center rounded-xl border border-[#0016A2]/15 bg-white px-7 py-3.5 font-extrabold text-[#0016A2] transition hover:border-[#79C2EF] hover:bg-[#79C2EF]/10"
            >
              Ver más propiedades
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F3F7FC] p-3.5 transition hover:border-[#79C2EF]/60 hover:bg-white">
      <div className="text-[#0016A2]">{icon}</div>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-extrabold text-[#0016A2]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="max-w-[65%] text-right text-sm font-bold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-black text-[#0016A2]">
      <span className="h-7 w-1 rounded-full bg-[#79C2EF]" />
      {children}
    </h2>
  );
}

function MediaCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-5 aspect-video overflow-hidden rounded-2xl bg-slate-100">
        {children}
      </div>
    </div>
  );
}
