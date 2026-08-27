import { supabase } from "@/lib/supabase";

export async function obtenerPropiedades() {
    const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
}

export async function obtenerDestacadas() {
    const { data, error } = await supabase
        .from("propiedades")
        .select("*")
        .eq("publicado", true)
        .eq("destacado", true);

    if (error) throw error;

    return data;
}