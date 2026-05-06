import React from 'react';
import Link from "next/link";
import { adminService } from '@/services/admin.service';
import DashboardCharts from '@/components/DashboardCharts';

export default async function AdminDashboardPage() {
  const stats = await adminService.getStats();
  const chartData = await adminService.getDashboardMetrics();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Resumen General</h1>
        <p className="text-gray-400 font-medium">Métricas clave del sistema RentVago en tiempo real.</p>
      </header>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/dashboard/properties" className="bg-black p-8 rounded-2xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-gray-700 transition-colors block">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Propiedades Totales</p>
          <p className="text-5xl font-black text-white relative z-10">{stats.totalProperties}</p>
        </Link>

        <Link href="/dashboard/users" className="bg-black p-8 rounded-2xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-green-500/30 transition-colors block">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Usuarios Activos</p>
          <p className="text-5xl font-black text-green-400 relative z-10">{stats.activeUsers}</p>
        </Link>

        <Link href="/dashboard/leases" className="bg-black p-8 rounded-2xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-gray-700 transition-colors block">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Arriendos Activos</p>
          <p className="text-5xl font-black text-gray-300 relative z-10">{stats.totalLeases}</p>
        </Link>
      </div>
      <div className='w-full'>
        <DashboardCharts data={chartData} />
      </div>
    </div>
  );
}
