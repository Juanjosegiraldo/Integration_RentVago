"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SesionUsuario {
    id: number;
    email: string;
    role: "ADMIN" | "USER";
    accessToken: string;
}

/**
 * Lee la sesión guardada en localStorage.
 * Se usa en componentes "client" para saber el rol del usuario y proteger vistas.
 */
export function getSesion(): SesionUsuario | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("sesion");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function guardarSesion(sesion: SesionUsuario) {
    localStorage.setItem("sesion", JSON.stringify(sesion));
}

export function cerrarSesion() {
    localStorage.removeItem("sesion");
}

/**
 * Hook que protege páginas del dashboard.
 * - Si no hay sesión → redirige a /login.
 * - Si requiereAdmin = true y el usuario no es ADMIN → redirige a /arrendamientos.
 */
export function useAuth(opciones?: { requiereAdmin?: boolean }) {
    const router = useRouter();
    const [sesion, setSesion] = useState<SesionUsuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const s = getSesion();
        if (!s) {
            router.replace("/login");
            return;
        }
        if (opciones?.requiereAdmin && s.role !== "ADMIN") {
            router.replace("/arrendamientos");
            return;
        }
        setSesion(s);
        setCargando(false);
    }, [router, opciones?.requiereAdmin]);

    return { sesion, cargando };
}

/**
 * Helper para hacer fetch con el accessToken puesto en el header.
 * Si la respuesta es 401, intenta refrescar el token automáticamente.
 */
export async function fetchAuth(url: string, opciones: RequestInit = {}): Promise<Response> {
    const sesion = getSesion();
    const headers = new Headers(opciones.headers);
    if (sesion?.accessToken) {
        headers.set("Authorization", `Bearer ${sesion.accessToken}`);
    }
    if (opciones.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    let res = await fetch(url, { ...opciones, headers });

    // Si el token expiró, intentamos refrescar y reintentamos una vez.
    if (res.status === 401 && sesion) {
        const refresh = await fetch("/api/auth/refresh", { method: "POST" });
        if (refresh.ok) {
            const data = await refresh.json();
            const nuevaSesion = { ...sesion, accessToken: data.accessToken };
            guardarSesion(nuevaSesion);
            headers.set("Authorization", `Bearer ${data.accessToken}`);
            res = await fetch(url, { ...opciones, headers });
        }
    }

    return res;
}
