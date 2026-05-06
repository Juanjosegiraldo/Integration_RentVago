// src/app/api/auth/register/route.ts
import { prisma } from "@/lib/db";
import { authLib } from "@/lib/auth";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";

/**
 * Registro de nuevos usuarios con contraseña hasheada.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // 1. Hashear la contraseña antes de guardarla
    const hashedPassword = await authLib.hashPassword(validation.data.password);

    // 2. Crear el usuario en la DB
    const user = await prisma.user.create({
      data: {
        email: validation.data.email,
        password: hashedPassword, // Guardamos el hash, no la contraseña real
        name: validation.data.name,
        role: "USER",
      }
    });

    // 3. Devolvemos el usuario sin la contraseña por seguridad
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario. ¿Quizás el email ya existe?" }, 
      { status: 400 }
    );
  }
}
