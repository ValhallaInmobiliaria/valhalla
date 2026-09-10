"use client";

import { useMemo, useState } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import CatalogFilters, {
  CatalogFiltersState,
} from "@/components/home/CatalogFilters";
import { isForRent, isForSale, normalizeOperation } from "@/lib/property-operation";
import type { WhatsAppChannel } from "@/lib/site";

interface Property {
  id: string;
  imagen_principal?: string | null;
  titulo?: string | null;
  ciudad?: string | null;
  estado?: string | null;
  operacion?: string | null;
  tipo?: string | null;
  precio?: number | null;
  area?: number | null;
  habitaciones?: number | null;
  banos?: number | null;
  parqueaderos?: number | null;
  habitaciones_count?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  direccion?: string | null;
  barrio?: string | null;
  codigo?: string | null;
}

interface PropertyCatalogProps {
  properties: Property[];
  initialOperation?: string;
}

const buildInitialFilters = (
  initialOperation = ""
): CatalogFiltersState => ({
  search: "",
  operacion: initialOperation,
  tipo: "",
  habitaciones: "",
  precioMin: "",
  precioMax: "",
});

export default function PropertyCatalog({
  properties,
  initialOperation = "",
}: PropertyCatalogProps) {
  const [filters, setFilters] = useState<CatalogFiltersState>(() =>
    buildInitialFilters(initialOperation)
  );

  const handleChange = (
    field: keyof CatalogFiltersState,
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(buildInitialFilters(initialOperation));
  };

  const whatsappChannel: WhatsAppChannel =
    normalizeOperation(initialOperation) === "arriendo"
      ? "arriendos"
      : "ventas";

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const search = filters.search.trim().toLowerCase();

      if (search) {
        const textoBusqueda = [
          property.titulo,
          property.ciudad,
          property.direccion,
          property.barrio,
          property.codigo,
          property.tipo,
          property.operacion,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!textoBusqueda.includes(search)) {
          return false;
        }
      }

      if (filters.operacion) {
        const operacion = normalizeOperation(property.operacion);
        const filtro = normalizeOperation(filters.operacion);

        if (filtro === "venta" && !isForSale(operacion)) {
          return false;
        }

        if (filtro === "arriendo" && !isForRent(operacion)) {
          return false;
        }

        if (filtro === "venta y arriendo") {
          if (operacion !== "venta y arriendo") {
            return false;
          }
        }
      }

      if (filters.tipo) {
        const tipo = String(property.tipo ?? "")
          .trim()
          .toLowerCase();

        if (!tipo.includes(filters.tipo.toLowerCase())) {
          return false;
        }
      }

      if (filters.habitaciones) {
        const habitacionesMin = Number(filters.habitaciones);
        const habitaciones = Number(
          property.habitaciones ??
            property.habitaciones_count ??
            property.rooms ??
            0
        );

        if (habitaciones < habitacionesMin) {
          return false;
        }
      }

      if (filters.precioMin) {
        const precioMin = Number(filters.precioMin);
        const precio = Number(property.precio ?? 0);

        if (precio < precioMin) {
          return false;
        }
      }

      if (filters.precioMax) {
        const precioMax = Number(filters.precioMax);
        const precio = Number(property.precio ?? 0);

        if (precio > precioMax) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  return (
    <div id="catalogo" className="space-y-10">
      <CatalogFilters
        filters={filters}
        onChange={handleChange}
        onClear={clearFilters}
      />

      {filteredProperties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} whatsappChannel={whatsappChannel} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#79C2EF]/20 text-[#0016A2]">
            <span className="text-2xl">⌕</span>
          </div>

          <h3 className="mt-5 text-2xl font-bold text-[#0016A2]">
            No encontramos propiedades
          </h3>

          <p className="mx-auto mt-2 max-w-md text-slate-500">
            No hay propiedades que coincidan con los filtros seleccionados.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-xl bg-[#0016A2] px-6 py-3 font-bold text-white transition hover:bg-[#79C2EF] hover:text-[#0016A2]"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
