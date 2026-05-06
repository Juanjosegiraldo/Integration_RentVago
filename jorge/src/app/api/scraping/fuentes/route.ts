import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/scraping/fuentes -> lista todas las fuentes
// Cualquier usuario autenticado puede ver (USER y ADMIN)
export async function GET() {
    try {
        const fuentes = await prisma.scrapingFuente.findMany({
            orderBy: { creadoEn: "desc" },
        });
        return NextResponse.json({ success: true, fuentes });
    } catch (error) {
        return NextResponse.json({ message: "Error al listar fuentes" }, { status: 500 });
    }
}

// POST /api/scraping/fuentes -> crea una fuente (solo ADMIN, validado en middleware)
export async function POST(req: Request) {
    try {
        const { nombre, url, activo } = await req.json();

        if (!nombre || !url) {
            return NextResponse.json({ message: "Nombre y URL requeridos" }, { status: 400 });
        }

        const fuente = await prisma.scrapingFuente.create({
            data: {
                nombre,
                url,
                activo: activo ?? true,
            },
        });

        return NextResponse.json({ success: true, fuente }, { status: 201 });
    } catch (error: unknown) {
        // Si la URL ya existe (campo @unique) Prisma tira un error P2002
        const message = error instanceof Error ? error.message : "Error al crear fuente";
        const statusCode = message.includes("Unique") ? 409 : 500;
        return NextResponse.json({ message: "Error al crear fuente" }, { status: statusCode });
    }
}
