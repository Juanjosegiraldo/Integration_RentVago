import { NextRequest, NextResponse } from "next/server";

const arriendosMedellin = [
    {
        id: 1,
        titulo: "Apartamento en arriendo en Laureles",
        precio: 2300000,
        ubicacion: "Laureles, Medellin",
        descripcion: "2 habitaciones, 2 banos, balcon, parqueadero y cerca a la 70.",
        urlFuente: "https://api-demo.arriendos.local/medellin/laureles/1",
        imagen: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80",
        creadoEn: "2026-04-27T10:00:00.000Z",
    },
    {
        id: 2,
        titulo: "Casa en arriendo en Belen Rosales",
        precio: 1850000,
        ubicacion: "Belen Rosales, Medellin",
        descripcion: "Casa de 3 habitaciones con patio, cocina integral y buen acceso a rutas.",
        urlFuente: "https://api-demo.arriendos.local/medellin/belen/2",
        imagen: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
        creadoEn: "2026-04-27T10:05:00.000Z",
    },
    {
        id: 3,
        titulo: "Apartaestudio en arriendo en El Poblado",
        precio: 2700000,
        ubicacion: "El Poblado, Medellin",
        descripcion: "Apartaestudio amoblado, 1 habitacion, porteria 24 horas y gimnasio.",
        urlFuente: "https://api-demo.arriendos.local/medellin/poblado/3",
        imagen: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
        creadoEn: "2026-04-27T10:10:00.000Z",
    },
    {
        id: 4,
        titulo: "Apartamento familiar en arriendo en Robledo",
        precio: 1450000,
        ubicacion: "Robledo, Medellin",
        descripcion: "3 habitaciones, sala comedor, cocina reformada y excelente iluminacion.",
        urlFuente: "https://api-demo.arriendos.local/medellin/robledo/4",
        imagen: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
        creadoEn: "2026-04-27T10:15:00.000Z",
    },
    {
        id: 5,
        titulo: "Casa en arriendo en Castilla",
        precio: 1700000,
        ubicacion: "Castilla, Medellin",
        descripcion: "Casa de dos niveles con terraza, 4 habitaciones y zona comercial cercana.",
        urlFuente: "https://api-demo.arriendos.local/medellin/castilla/5",
        imagen: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80",
        creadoEn: "2026-04-27T10:20:00.000Z",
    },
    {
        id: 6,
        titulo: "Apartamento en arriendo en Buenos Aires",
        precio: 1520000,
        ubicacion: "Buenos Aires, Medellin",
        descripcion: "2 habitaciones, 2 banos, cerca al tranvia y con balcon exterior.",
        urlFuente: "https://api-demo.arriendos.local/medellin/buenos-aires/6",
        imagen: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=80",
        creadoEn: "2026-04-27T10:25:00.000Z",
    },
    {
        id: 7,
        titulo: "Apartamento en arriendo en Manrique Central",
        precio: 1280000,
        ubicacion: "Manrique Central, Medellin",
        descripcion: "3 habitaciones, cocina abierta y acceso rapido al centro de Medellin.",
        urlFuente: "https://api-demo.arriendos.local/medellin/manrique/7",
        imagen: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80",
        creadoEn: "2026-04-27T10:30:00.000Z",
    },
    {
        id: 8,
        titulo: "Apartamento en arriendo en Envigado sector frontera",
        precio: 2400000,
        ubicacion: "Envigado, Area Metropolitana de Medellin",
        descripcion: "2 habitaciones con estudio, unidad cerrada, parqueadero y zonas comunes.",
        urlFuente: "https://api-demo.arriendos.local/medellin/envigado/8",
        imagen: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
        creadoEn: "2026-04-27T10:35:00.000Z",
    },
];

export async function GET(req: NextRequest) {
    const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();

    const resultados = q
        ? arriendosMedellin.filter((item) => {
            const texto = [
                item.titulo,
                item.ubicacion,
                item.descripcion,
            ].join(" ").toLowerCase();

            return texto.includes(q);
        })
        : arriendosMedellin;

    return NextResponse.json({
        success: true,
        total: resultados.length,
        items: resultados,
    });
}
