import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <h1 className="text-6xl font-black text-white tracking-tight">
        Rent<span className="text-green-400">Vago</span>
      </h1>
      <p className="text-gray-400 text-xl text-center">
        Plataforma de alquiler de casas y apartamentos
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/catalog"
          className="bg-green-500 text-black font-extrabold px-6 py-3 rounded-2xl hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          Ver propiedades
        </Link>
        <Link
          href="/login"
          className="border border-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-2xl hover:border-green-500 hover:text-green-400 transition-all"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
