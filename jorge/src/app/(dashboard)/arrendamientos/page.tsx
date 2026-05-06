"use client";
import { useEffect, useState } from "react";
import { useAuth, fetchAuth } from "@/hooks/useAuth";

interface Arrendamiento {
    id: number;
    titulo: string;
    precio: number;
    ubicacion?: string | null;
    descripcion?: string | null;
    imagen?: string | null;
    urlFuente: string;
    creadoEn: string;
}

export default function ArrendamientosPage() {
    const { sesion, cargando } = useAuth();
    const [arrendamientos, setArrendamientos] = useState<Arrendamiento[]>([]);
    const [cargandoLista, setCargandoLista] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [buscando, setBuscando] = useState(false);
    const [fuenteApi, setFuenteApi] = useState(false);

    useEffect(() => {
        if (!sesion) return;
        cargarDesdeDB();
    }, [sesion]);

    async function cargarDesdeDB() {
        setCargandoLista(true);
        setFuenteApi(false);
        try {
            const res = await fetchAuth("/api/scraping/arrendamientos");
            const data = await res.json();
            if (data.success) setArrendamientos(data.arrendamientos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoLista(false);
        }
    }

    async function buscarEnApi() {
        if (!busqueda.trim()) return;
        setBuscando(true);
        setFuenteApi(false);
        try {
            const res = await fetch(`/api/arriendos?q=${encodeURIComponent(busqueda)}`);
            const data = await res.json();
            if (data.success) {
                setArrendamientos(data.items);
                setFuenteApi(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBuscando(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") buscarEnApi();
    }

    if (cargando) {
        return <p className="text-gray-400">Cargando...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Arrendamientos disponibles</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {arrendamientos.length} resultados
                        {fuenteApi && (
                            <span className="ml-2 text-emerald-400">· API de arriendos</span>
                        )}
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Ciudad o barrio..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex-1 sm:w-56"
                    />
                    <button
                        onClick={buscarEnApi}
                        disabled={buscando || !busqueda.trim()}
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium transition-colors"
                    >
                        {buscando ? "Buscando..." : "Buscar"}
                    </button>
                    {fuenteApi && (
                        <button
                            onClick={cargarDesdeDB}
                            className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Ver todos
                        </button>
                    )}
                </div>
            </div>

            {cargandoLista || buscando ? (
                <p className="text-gray-400">Cargando arrendamientos...</p>
            ) : arrendamientos.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-12 text-center">
                    <p className="text-gray-400">No hay arrendamientos para mostrar.</p>
                    {sesion?.role === "ADMIN" && (
                        <p className="text-gray-500 text-sm mt-2">
                            Ve al panel admin y ejecuta el scraping, o usa el buscador para traer datos desde la API de arriendos.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {arrendamientos.map((a) => (
                        <article
                            key={a.id}
                            className="bg-white/[0.03] backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden shadow-lg shadow-emerald-900/10 hover:border-emerald-500/40 transition-all"
                        >
                            {a.imagen ? (
                                <img
                                    src={a.imagen}
                                    alt={a.titulo}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-white/5 flex items-center justify-center text-gray-600 text-sm">
                                    Sin imagen
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="font-semibold text-white text-lg leading-tight">{a.titulo}</h3>
                                {a.ubicacion && (
                                    <p className="text-xs text-gray-400 mt-1">{a.ubicacion}</p>
                                )}
                                <p className="text-2xl font-bold text-emerald-400 mt-4">
                                    ${a.precio.toLocaleString("es-CO")}
                                </p>
                                {a.descripcion && (
                                    <p className="text-sm text-gray-400 mt-3 line-clamp-3">{a.descripcion}</p>
                                )}
                                <a
                                    href={a.urlFuente}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 text-xs text-emerald-400 hover:text-emerald-300"
                                >
                                    Ver fuente →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
