import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const userId = parseInt(req.headers.get("x-user-id")!);
        const { name, description, type, config } = await req.json();

        const agent = await prisma.agent.create({
            data: {
                name,
                description,
                userId,
                isPublic: true,
                type,
                config
            }
        });

        return NextResponse.json({ success: true, agent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al persistir agente" }, { status: 500 });
    }
}