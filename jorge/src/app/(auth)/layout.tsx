import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Acceso - Arrendamientos CO",
    description: "Inicia sesión o crea tu cuenta",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-black overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Acceso seguro</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        Arrendamientos <span className="text-emerald-400">CO</span>
                    </h1>
                </div>
                {children}
                <p className="text-center mt-8 text-sm text-gray-500 font-light">
                    &copy; 2026 Arrendamientos CO
                </p>
            </div>
        </div>
    );
}
