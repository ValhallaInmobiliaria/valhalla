"use client";

import { useRouter } from "next/navigation";

interface Props {
    id: string;
}

export default function DeleteButton({ id }: Props) {
    const router = useRouter();

    async function eliminar() {
        const ok = confirm(
            "¿Seguro que deseas eliminar esta propiedad?"
        );

        if (!ok) return;

        const res = await fetch("/api/propiedades", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!res.ok) {
            alert("No se pudo eliminar.");
            return;
        }

        alert("Propiedad eliminada.");

        router.refresh();
    }

    return (
        <button
            onClick={eliminar}
            className="text-red-600 hover:text-red-800 font-medium"
        >
            Eliminar
        </button>
    );
}