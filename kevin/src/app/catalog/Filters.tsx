"use client";

import { useQueryState } from 'nuqs';

export default function Filters() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [minPrice, setMinPrice] = useQueryState('minPrice', { defaultValue: '' });

  return (
    <div className="flex flex-wrap gap-6 bg-black p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-gray-800">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Búsqueda</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Poblado, Apartamento..."
          className="w-full px-5 py-3.5 rounded-2xl bg-gray-900 border border-gray-800 text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-600 font-medium"
        />
      </div>

      <div className="w-[200px]">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Precio Mínimo</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Mínimo"
            className="w-full pl-8 pr-5 py-3.5 rounded-2xl bg-gray-900 border border-gray-800 text-white focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-600 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
