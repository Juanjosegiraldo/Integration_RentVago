"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth, fetchAuth } from "@/hooks/useAuth";

interface Fuente {
    id: number;
    nombre: string;
    url: string;
    activo: boolean;
    creadoEn: string;
}

export default function AdminPage() {
    // Esta página solo la ven los ADMIN. Si entra un USER, useAuth lo redirige.
    const { sesion, cargando } = useAuth({ requiereAdmin: true });

    const [fuentes, setFuentes] = useState<Fuente[]>([]);
    const [cargandoFuentes, setCargandoFuentes] = useState(true);
    const [ejecutando, setEjecutando] = useState(false);

    // Form para crear o editar
    const [form, setForm] = useState<{ id: number | null; nombre: string; url: string; activo: boolean }>({
        id: null,
        nombre: "",
        url: "",
        activo: true,
    });

    useEffect(() => {
        if (!sesion) return;
        cargarFuentes();
    }, [sesion]);

    async function cargarFuentes() {
        try {
            const res = await fetchAuth("/api/scraping/fuentes");
            const data = await res.json();
            if (data.success) setFuentes(data.fuentes);
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoFuentes(false);
        }
    }

    async function handleGuardar(e: React.FormEvent) {
        e.preventDefault();
        if (!form.nombre || !form.url) {
            Swal.fire({ icon: "warning", title: "Faltan campos", text: "Nombre y URL son requeridos" });
            return;
        }

        try {
            const url = form.id ? `/api/scraping/fuentes/${form.id}` : "/api/scraping/fuentes";
            const method = form.id ? "PUT" : "POST";

            const res = await fetchAuth(url, {
                method,
                body: JSON.stringify({ nombre: form.nombre, url: form.url, activo: form.activo }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Error");

            await Swal.fire({
                icon: "success",
                title: form.id ? "Fuente actualizada" : "Fuente creada",
                timer: 1200,
                showConfirmButton: false,
            });
            setForm({ id: null, nombre: "", url: "", activo: true });
            cargarFuentes();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error";
            Swal.fire({ icon: "error", title: "Error", text: message });
        }
    }

    async function handleEditar(f: Fuente) {
        setForm({ id: f.id, nombre: f.nombre, url: f.url, activo: f.activo });
    }

    async function handleEliminar(id: number) {
        const conf = await Swal.fire({
            icon: "warning",
            title: "¿Eliminar fuente?",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        });
        if (!conf.isConfirmed) return;

        const res = await fetchAuth(`/api/scraping/fuentes/${id}`, { method: "DELETE" });
        if (res.ok) {
            cargarFuentes();
        }
    }

    async function handleEjecutar() {
        setEjecutando(true);
        try {
            const res = await fetchAuth("/api/scraping/ejecutar", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error");

            const total = data.resultados.reduce((acc: number, r: { guardados: number }) => acc + r.guardados, 0);
            const resumen = data.resultados
                .map((r: { fuente: string; guardados: number; descartados: number; error?: string }) =>
                    r.error
                        ? `${r.fuente}: ERROR (${r.error})`
                        : `${r.fuente}: ${r.guardados} guardados, ${r.descartados} descartados`
                )
                .join("\n");

            await Swal.fire({
                icon: "success",
                title: `Scraping completado`,
                text: `Total guardados: ${total}`,
                footer: `<pre style="text-align:left;white-space:pre-wrap;font-size:11px">${resumen}</pre>`,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error";
            Swal.fire({ icon: "error", title: "Error", text: message });
        } finally {
            setEjecutando(false);
        }
    }

    if (cargando) {
        return <p className="text-gray-400">Cargando...</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Solo administradores</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Panel Admin</h1>
                    <p className="text-gray-400 text-sm mt-1">Gestiona fuentes y ejecuta el scraping</p>
                </div>

                <button
                    onClick={handleEjecutar}
                    disabled={ejecutando}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                >
                    {ejecutando ? "Ejecutando..." : "Ejecutar scraping ahora"}
                </button>
            </div>

            {/* Formulario crear / editar */}
            <section className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h2 className="font-semibold text-white text-lg mb-4">
                    {form.id ? "Editar fuente" : "Nueva fuente"}
                </h2>

                <form onSubmit={handleGuardar} className="grid gap-4 sm:grid-cols-2">
                    <input
                        type="text"
                        placeholder="Nombre de la fuente"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <input
                        type="url"
                        placeholder="https://api.ejemplo.co/arrendamientos"
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />

                    <label className="flex items-center gap-3 text-sm text-gray-300 sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.activo}
                            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                            className="w-5 h-5 accent-emerald-500"
                        />
                        Activa (será procesada por el cron y al ejecutar manualmente)
                    </label>

                    <div className="flex gap-2 sm:col-span-2">
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-medium transition-all active:scale-[0.98]"
                        >
                            {form.id ? "Actualizar" : "Crear fuente"}
                        </button>
                        {form.id && (
                            <button
                                type="button"
                                onClick={() => setForm({ id: null, nombre: "", url: "", activo: true })}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-medium transition-all"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Lista de fuentes */}
            <section>
                <h2 className="font-semibold text-white text-lg mb-4">Fuentes registradas</h2>

                {cargandoFuentes ? (
                    <p className="text-gray-400">Cargando fuentes...</p>
                ) : fuentes.length === 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center text-gray-400">
                        Aún no hay fuentes registradas.
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {fuentes.map((f) => (
                            <div
                                key={f.id}
                                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-white">{f.nombre}</h3>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${f.activo
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-white/5 text-gray-500 border border-white/10"
                                                }`}
                                        >
                                            {f.activo ? "Activa" : "Inactiva"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 truncate">{f.url}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditar(f)}
                                        className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-full transition-all"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(f.id)}
                                        className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-all"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
