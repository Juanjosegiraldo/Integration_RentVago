// src/components/layout/Navbar.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { LogOut, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/app/actions/db-actions";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("access_token");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-black text-white tracking-tight hover:text-green-400 transition-colors">
          Rent<span className="text-green-400">Vago</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Catálogo
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-green-400 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="text-sm font-bold bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400 transition-all">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
