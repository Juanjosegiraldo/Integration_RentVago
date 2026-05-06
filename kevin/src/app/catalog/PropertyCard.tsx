"use client";

export default function PropertyCard({ property }: { property: any }) {
  return (
    <div className="group bg-black rounded-3xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:border-green-500/50 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] transition-all overflow-hidden relative">
      <div className="aspect-video relative overflow-hidden bg-gray-900">
        {property.image ? (
          <img 
            src={property.image.includes('fbcdn.net') ? `/api/image-proxy?url=${encodeURIComponent(property.image)}` : property.image} 
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-medium">
             <span className="text-sm">Sin imagen</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-sm font-black shadow-[0_0_15px_rgba(34,197,94,0.4)]">
          ${Number(property.price).toLocaleString('es-CO')} / mes
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
          {property.title}
        </h3>
        <p className="text-gray-400 text-sm flex items-center gap-2 mb-6 font-medium">
          <span className="text-green-500 font-bold">Dirección:</span> {property.address}
        </p>
        
        <button className="w-full bg-gray-900 text-white border border-gray-700 py-3.5 rounded-2xl font-bold hover:bg-green-500 hover:text-black hover:border-green-500 transition-all active:scale-[0.98] shadow-lg">
            Reservar ahora
        </button>
      </div>
    </div>
  );
}
