"use client";

export default function SearchBar() {
    return (
        <div className="absolute bottom-10 left-1/2 w-[95%] max-w-6xl -translate-x-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="grid gap-4 md:grid-cols-4">
                <input
                    className="rounded-lg border p-3"
                    placeholder="Ciudad"
                />

                <select className="rounded-lg border p-3">
                    <option>Tipo de inmueble</option>
                    <option>Casa</option>
                    <option>Apartamento</option>
                    <option>Lote</option>
                    <option>Local</option>
                </select>

                <input
                    className="rounded-lg border p-3"
                    placeholder="Precio máximo"
                />

                <button className="rounded-lg bg-[#0016A2] text-white font-semibold hover:opacity-90">
                    Buscar
                </button>
            </div>
        </div>
    );
}