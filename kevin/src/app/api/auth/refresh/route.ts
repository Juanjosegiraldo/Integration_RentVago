// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { authLib } from "@/lib/auth";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secreto_super_seguro");

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cookieRefreshToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith("refresh_token="))
      ?.split("=")[1];
    const refreshToken = body.refreshToken || cookieRefreshToken;

    if (!refreshToken) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    // 1. Verificar que el Refresh Token sea válido y no esté expirado
    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
    const userId = Number(payload.userId);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.userId !== userId || storedToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh token inválido o expirado" }, { status: 401 });
    }

    // 2. Generar un nuevo Access Token con el userId del payload
    const newAccessToken = await authLib.generateAccessToken(
      storedToken.user.id,
      storedToken.user.role,
      storedToken.user.email
    );

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;

  } catch (error) {
    // Si el token está expirado o es inválido, jwtVerify lanza un error
    return NextResponse.json({ error: "Refresh token inválido o expirado" }, { status: 401 });
  }
}
