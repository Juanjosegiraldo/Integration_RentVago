// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authLib } from "@/lib/auth";

// Listar todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
