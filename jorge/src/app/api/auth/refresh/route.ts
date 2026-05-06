import { NextResponse } from "next/server";
import { validateRefreshToken, generateAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ message: "No hay refresh token" }, { status: 401 });
        }

        const decoded = await validateRefreshToken(refreshToken);

        if (!decoded) {
            return NextResponse.json({ message: "Refresh token inválido o expirado" }, { status: 403 });
        }

        const newPayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        const newAccessToken = await generateAccessToken(newPayload);

        return NextResponse.json({
            accessToken: newAccessToken
        });

    } catch (error: any) {
        return NextResponse.json({ message: "Error al refrescar token", error: error.message }, { status: 500 });
    }
}
