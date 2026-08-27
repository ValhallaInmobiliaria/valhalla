import { supabase } from "@/lib/supabase";

export default async function TestPage() {
    const { data, error } = await supabase
        .from("propiedades")
        .select("*");

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">
                Propiedades
            </h1>

            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}