import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-8 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-black">
            <div className="text-center max-w-3xl">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                        Arrendamientos en Colombia
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
                    Encuentra tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">próximo hogar</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-10 font-light leading-relaxed">
                    Una plataforma que recopila los mejores arrendamientos de Colombia
                    y los actualiza automáticamente.
                </p>

                <div className="flex gap-3 justify-center flex-wrap">
                    <Link
                        href="/register"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                    >
                        Empezar ahora
                    </Link>
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </main>
    );
}
