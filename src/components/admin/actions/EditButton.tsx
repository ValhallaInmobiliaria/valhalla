"use client";

interface Props {
    id: string;
}

export default function EditButton({ id }: Props) {

    return (

        <button
            className="text-blue-600 hover:text-blue-800 font-medium"
        >
            Editar
        </button>

    );

}