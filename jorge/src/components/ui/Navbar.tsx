"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSesion, cerrarSesion } from "@/hooks/useAuth";

export default function Navbar() {
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const s = getSesion();
        setRole(s?.role ?? null);
        setEmail(s?.email ?? null);
    }, [pathname]);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        cerrarSesion();
        setRole(null);
        setEmail(null);
        router.push("/login");
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="text-lg font-bold tracking-tight">
                    Arrendamientos <span className="text-emerald-400">CO</span>
                </Link>

                <div className="flex items-center gap-2 text-sm">
                    {!role && (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-full text-gray-300 hover:bg-white/5 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}

                    {role && (
                        <>
                            <Link
                                href="/arrendamientos"
                                className="px-4 py-2 rounded-full text-gray-300 hover:bg-white/5 transition-all"
                            >
                                Arrendamientos
                            </Link>

                            {role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="px-4 py-2 rounded-full text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                >
                                    Panel Admin
                                </Link>
                            )}

                            <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400 hidden sm:inline">
                                {email} · {role}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
                            >
                                Salir
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
