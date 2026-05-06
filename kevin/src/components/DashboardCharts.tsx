"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

interface ChartDataItem {
  name: string;
  value: number;
}

interface UserTrendItem {
  name: string;
  usuarios: number;
}

interface DashboardMetrics {
  propertyData: ChartDataItem[];
  userData: UserTrendItem[];
  leaseData: ChartDataItem[];
}

export default function DashboardCharts({ data }: { data: DashboardMetrics }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Forzamos un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 h-[300px] animate-pulse bg-white/5 rounded-2xl" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 w-full">
      {/* Gráfica de Propiedades */}
      <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Distribución de Propiedades</h3>
        {/* Contenedor con alto fijo y min-width 0 para arreglar el bug de Grid */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="99%" height={300}>
            <BarChart data={data.propertyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de Estados de Arriendo */}
      <div className="bg-[#0a0a0a] p-6 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Estado de Arriendos</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="99%" height={300}>
            <PieChart>
              <Pie
                data={data.leaseData}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.leaseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
