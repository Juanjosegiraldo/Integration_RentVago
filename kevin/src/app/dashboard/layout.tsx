import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Home } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-950 overflow-hidden text-gray-100">
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-black border-r border-gray-800 shadow-2xl z-10 flex flex-col">
                <div className="p-8 border-b border-gray-800">
                    <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2 h-6 bg-green-500 rounded-sm"></span>
                        Admin
                    </h2>
                </div>
                <nav className="mt-6 flex-1 px-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-green-400 transition-all group font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Métricas
                    </Link>

                    <Link
                        href="/dashboard/users"
                        className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-green-400 transition-all group font-medium"
                    >
                        <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Usuarios
                    </Link>

                    <Link
                        href="/dashboard/properties"
                        className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-green-400 transition-all group font-medium"
                    >
                        <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Propiedades
                    </Link>
                    <Link
                        href="/dashboard/leases"
                        className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-green-400 transition-all group font-medium"
                    >
                        <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Arriendos
                    </Link>


                </nav>


                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center px-4 py-3 text-gray-500 rounded-lg hover:bg-gray-900 hover:text-white transition-all font-medium"
                    >
                        <Home className="w-5 h-5 mr-3" />
                        Sitio Público
                    </Link>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 overflow-y-auto p-10 bg-gray-950/50">
                {children}
            </main>
        </div>
    );
}
