import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// PUT /api/scraping/fuentes/:id -> actualiza una fuente (solo ADMIN)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);
        const { nombre, url, activo } = await req.json();

        if (isNaN(idNum)) {
            return NextResponse.json({ message: "ID inválido" }, { status: 400 });
        }

        const fuente = await prisma.scrapingFuente.update({
            where: { id: idNum },
            data: {
                ...(nombre !== undefined && { nombre }),
                ...(url !== undefined && { url }),
                ...(activo !== undefined && { activo }),
            },
        });

        return NextResponse.json({ success: true, fuente });
    } catch (error) {
        return NextResponse.json({ message: "Error al actualizar fuente" }, { status: 500 });
    }
}

// DELETE /api/scraping/fuentes/:id -> elimina una fuente (solo ADMIN)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idNum = parseInt(id);

        if (isNaN(idNum)) {
            return NextResponse.json({ message: "ID inválido" }, { status: 400 });
        }

        await prisma.scrapingFuente.delete({ where: { id: idNum } });
        return NextResponse.json({ success: true, message: "Fuente eliminada" });
    } catch (error) {
        return NextResponse.json({ message: "Error al eliminar fuente" }, { status: 500 });
    }
}
