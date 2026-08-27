import Image from "next/image";
import Link from "next/link";
import { isImageUrl } from "@/lib/media";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  CarFront,
  MapPin,
  Ruler,
} from "lucide-react";

interface Property {
  id: string;
  titulo?: string | null;
  ciudad?: string | null;
  imagen_principal?: string | null;
  precio?: number | string | null;
  operacion?: string | null;
  area?: number | string | null;
  habitaciones?: number | string | null;
  banos?: number | string | null;
  parqueaderos?: number | string | null;
}

interface PropertyCardProps {
  property: Property;
}

const money = (value: number | string | null | undefined) =>
  value !== null && value !== undefined && value !== ""
    ? `$${Number(value).toLocaleString("es-CO")}`
    : "Consultar precio";

export default function PropertyCard({ property }: PropertyCardProps) {
  const operation = String(property.operacion || "Propiedad").toUpperCase();

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)] transition duration-500 hover:-translate-y-1.5 hover:border-[#79C2EF]/60 hover:shadow-[0_24px_65px_rgba(0,22,162,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9f1f8]">
        {isImageUrl(property.imagen_principal) ? (
          <Image
            src={property.imagen_principal}
            alt={property.titulo || "Propiedad"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin imagen disponible
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="rounded-full bg-[#0016A2] px-3.5 py-1.5 text-[10px] font-extrabold tracking-[0.16em] text-white shadow-lg">
            {operation}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#0016A2] shadow-lg backdrop-blur">
            VALHALLA
          </span>
        </div>

        <Link
          href={`/propiedades/${property.id}`}
          className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-[#0016A2] shadow-xl transition hover:bg-[#79C2EF]"
        >
          Ver propiedad <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          <MapPin size={14} className="text-[#79C2EF]" />
          {property.ciudad || "Ubicación no disponible"}
        </div>

        <h3 className="mt-3 line-clamp-2 text-[21px] font-extrabold leading-tight text-[#0016A2]">
          {property.titulo || "Propiedad disponible"}
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-[#F3F7FC] p-2 sm:grid-cols-4">
          <Feature
            icon={<Ruler size={15} />}
            label="Área"
            value={property.area ? `${property.area} m²` : "—"}
          />
          <Feature
            icon={<BedDouble size={15} />}
            label="Habit."
            value={
              property.habitaciones != null
                ? String(property.habitaciones)
                : "—"
            }
          />
          <Feature
            icon={<Bath size={15} />}
            label="Baños"
            value={property.banos != null ? String(property.banos) : "—"}
          />
          <Feature
            icon={<CarFront size={15} />}
            label="Parq."
            value={
              property.parqueaderos != null
                ? String(property.parqueaderos)
                : "—"
            }
          />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Precio
            </p>
            <p className="mt-1 text-xl font-black text-[#0016A2]">
              {money(property.precio)}
            </p>
          </div>
          <Link
            href={`/propiedades/${property.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0016A2] transition hover:text-[#79C2EF]"
          >
            Detalles <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Feature({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[#0016A2]">
        {icon}
      </div>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-extrabold text-slate-700">{value}</p>
    </div>
  );
}
