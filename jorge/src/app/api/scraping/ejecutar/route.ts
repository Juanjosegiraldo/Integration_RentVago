import { NextResponse } from "next/server";
import { ejecutarScrapingDeTodasLasFuentes } from "@/services/scraping";

// POST /api/scraping/ejecutar -> dispara el scraping manualmente (solo ADMIN)
// El middleware ya valida que el rol sea ADMIN antes de llegar aquí.
export async function POST() {
    try {
        const resultados = await ejecutarScrapingDeTodasLasFuentes();
        return NextResponse.json({ success: true, resultados });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error al ejecutar scraping";
        return NextResponse.json({ message }, { status: 500 });
    }
}
