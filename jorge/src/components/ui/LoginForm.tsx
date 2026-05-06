"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { guardarSesion } from "@/hooks/useAuth";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        try {
            e.preventDefault();
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "error");
            }

            // Guardamos la sesión completa: id, email, role y accessToken
            guardarSesion({
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
                accessToken: data.accessToken,
            });

            await Swal.fire({
                title: `Bienvenid@ ${email}`,
                text: "Sesión iniciada.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            // Redirigimos según el rol
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/arrendamientos");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un problema";
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Reintentar",
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <h2 className="text-xl font-semibold text-white/90 text-center mb-2">Ingresa a tu cuenta</h2>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Correo Electrónico</label>
                <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Contraseña</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] mt-2"
            >
                Iniciar Sesión
            </button>

            <div className="text-center mt-2">
                <p className="text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </form>
    );
}
