import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseKey() {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        ""
    );
}

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        getSupabaseKey(),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },

                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Puede ocurrir cuando se ejecuta desde un Server Component.
                        // La actualización de sesión la maneja el proxy.
                    }
                },
            },
        }
    );
}