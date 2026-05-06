import { prisma } from "@/lib/db";
import PropertyCard from "./PropertyCard";
import Filters from "./Filters";

// Forzamos que Next.js siempre traiga datos frescos de la DB
export const dynamic = 'force-dynamic';

interface SearchParams {
  query?: string;
  minPrice?: string;
}

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const params = await searchParams;
  
  // Consulta a Prisma con filtros de URL
  const properties = await prisma.property.findMany({
    where: {
      AND: [
        params.query ? {
          OR: [
            { title: { contains: params.query, mode: 'insensitive' } },
            { address: { contains: params.query, mode: 'insensitive' } },
          ]
        } : {},
        params.minPrice ? {
          price: { gte: parseFloat(params.minPrice) }
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">Descubre tu próximo hogar</h1>
          <p className="text-gray-400 text-lg font-medium">Encuentra los mejores arriendos verificados por RentVago.</p>
        </div>
      </div>
      
      <div className="mb-12 relative z-10">
        <Filters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={{
              ...property,
              price: Number(property.price) // Convierte Decimal a número normal
            }} 
          />
        ))}
        
        {properties.length === 0 && (
          <div className="col-span-full text-center py-32 bg-black rounded-[40px] border border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="text-6xl mb-4 text-gray-800 italic relative z-10">"Pura soledad..."</div>
            <p className="text-gray-500 text-xl font-medium relative z-10">No hay propiedades que coincidan con estos filtros.</p>
            <button className="mt-8 text-green-400 font-bold hover:text-green-300 hover:underline relative z-10 transition-colors">Limpiar todos los filtros</button>
          </div>
        )}
      </div>
    </main>
  );
}
