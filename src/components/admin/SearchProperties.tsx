"use client";

import { Search } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchProperties({
    value,
    onChange,
}: Props) {
    return (
        <div className="relative mb-6">
            <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
            />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar propiedad..."
                className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0016A2]"
            />
        </div>
    );
}