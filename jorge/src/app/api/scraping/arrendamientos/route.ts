import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/scraping/arrendamientos -> lista arrendamientos guardados
// Visible para cualquier usuario autenticado (USER y ADMIN)
export async function GET() {
    try {
        const arrendamientos = await prisma.arrendamiento.findMany({
            orderBy: { creadoEn: "desc" },
            take: 100,
        });
        return NextResponse.json({ success: true, arrendamientos });
    } catch (error) {
        return NextResponse.json({ message: "Error al listar arrendamientos" }, { status: 500 });
    }
}
