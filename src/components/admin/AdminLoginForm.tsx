"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError("");

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("Correo o contraseña incorrectos.");
            setLoading(false);
            return;
        }

        const next = searchParams.get("next");

        router.replace(
            next?.startsWith("/gestion-valhalla")
                ? next
                : "/gestion-valhalla"
        );

        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F3F7FC] px-5 py-10">
            <div className="w-full max-w-md">
                <div className="rounded-[2rem] bg-white p-8 shadow-[0_25px_80px_rgba(0,22,162,0.12)] sm:p-10">
                    <div className="mb-8">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0016A2] text-white">
                            <LockKeyhole size={25} />
                        </div>

                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0016A2]">
                            Valhalla
                        </p>

                        <h1 className="mt-2 text-3xl font-black text-[#0016A2]">
                            Gestión inmobiliaria
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Ingresa con tu cuenta administrativa para gestionar las
                            propiedades.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Correo electrónico
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#0016A2] focus:ring-4 focus:ring-[#0016A2]/10"
                                    placeholder="correo@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#0016A2] focus:ring-4 focus:ring-[#0016A2]/10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-5 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Ingresando..." : "Ingresar al panel"}
                            {!loading && <ArrowRight size={17} />}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Valhalla Inmobiliaria · Área administrativa
                </p>
            </div>
        </main>
    );
}