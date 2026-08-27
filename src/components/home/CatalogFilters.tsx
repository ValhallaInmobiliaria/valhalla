"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export interface CatalogFiltersState {
  search: string;
  operacion: string;
  tipo: string;
  habitaciones: string;
  precioMin: string;
  precioMax: string;
}

interface CatalogFiltersProps {
  filters: CatalogFiltersState;
  onChange: (field: keyof CatalogFiltersState, value: string) => void;
  onClear: () => void;
}

export default function CatalogFilters({
  filters,
  onChange,
  onClear,
}: CatalogFiltersProps) {
  const hayFiltros = Object.values(filters).some(Boolean);

  const field =
    "w-full rounded-xl border border-slate-200 bg-[#F3F7FC] px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#79C2EF] focus:bg-white focus:ring-4 focus:ring-[#79C2EF]/20";

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6 lg:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0016A2]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#79C2EF]/25">
              <SlidersHorizontal size={18} />
            </span>
            <p className="text-sm font-extrabold">Encuentra lo que buscas</p>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Filtra por ubicación, operación, tipo, habitaciones y presupuesto.
          </p>
        </div>

        {hayFiltros && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#F3F7FC] px-4 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-[#e8f0f7] lg:self-auto"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="relative mt-6">
        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Buscar por título, ciudad, barrio o ubicación..."
          className={`${field} py-4 pl-11`}
          aria-label="Buscar propiedades"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Filter label="Operación">
          <select
            value={filters.operacion}
            onChange={(e) => onChange("operacion", e.target.value)}
            className={field}
          >
            <option value="">Todas</option>
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
            <option value="venta y arriendo">Venta y arriendo</option>
          </select>
        </Filter>

        <Filter label="Tipo de inmueble">
          <select
            value={filters.tipo}
            onChange={(e) => onChange("tipo", e.target.value)}
            className={field}
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="apartamento/casa">Apartamento / Casa</option>
            <option value="lote">Lote</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="bodega">Bodega</option>
            <option value="finca">Finca</option>
            <option value="consultorio">Consultorio</option>
            <option value="edificio">Edificio</option>
          </select>
        </Filter>

        <Filter label="Habitaciones">
          <select
            value={filters.habitaciones}
            onChange={(e) => onChange("habitaciones", e.target.value)}
            className={field}
          >
            <option value="">Cualquiera</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} o más
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Precio mínimo">
          <input
            type="number"
            min="0"
            value={filters.precioMin}
            onChange={(e) => onChange("precioMin", e.target.value)}
            placeholder="$ Mínimo"
            className={field}
          />
        </Filter>

        <Filter label="Precio máximo">
          <input
            type="number"
            min="0"
            value={filters.precioMax}
            onChange={(e) => onChange("precioMax", e.target.value)}
            placeholder="$ Máximo"
            className={field}
          />
        </Filter>
      </div>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}
