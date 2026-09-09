"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Building2,
    LayoutDashboard,
    LogOut,
    Plus,
    Settings,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const navigation = [
    {
        name: "Resumen",
        href: "/gestion-valhalla",
        icon: LayoutDashboard,
    },
    {
        name: "Propiedades",
        href: "/gestion-valhalla/propiedades",
        icon: Building2,
    },
    {
        name: "Nueva propiedad",
        href: "/gestion-valhalla/propiedades/nueva",
        icon: Plus,
    },
];

export default function AdminShell({
    children,
    email,
}: {
    children: React.ReactNode;
    email: string;
}) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();

        await supabase.auth.signOut();

        router.replace("/gestion-valhalla/login");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-[#F3F7FC] text-slate-900">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                    <div className="border-b border-slate-100 px-7 py-7">
                        <Link href="/gestion-valhalla">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#79C2EF]">
                                Valhalla
                            </p>

                            <h1 className="mt-1 text-2xl font-black text-[#0016A2]">
                                Gestión
                            </h1>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-2 p-5">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            const active =
                                pathname === item.href ||
                                (item.href !== "/gestion-valhalla" &&
                                    pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${active
                                        ? "bg-[#0016A2] text-white shadow-lg"
                                        : "text-slate-500 hover:bg-[#F3F7FC] hover:text-[#0016A2]"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-slate-100 p-5">
                        <div className="mb-4 rounded-xl bg-[#F3F7FC] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Sesión
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-[#0016A2]">
                                {email}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={18} />
                            Cerrar sesión
                        </button>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0016A2]">
                                    Panel administrativo
                                </p>

                                <p className="mt-1 hidden text-sm text-slate-400 sm:block">
                                    Gestiona el inventario de Valhalla Inmobiliaria.
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    </header>

                    <main className="p-5 sm:p-8 lg:p-10">{children}</main>
                </div>
            </div>
        </div>
    );
}