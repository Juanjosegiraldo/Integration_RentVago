import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "Sesión cerrada" });

    // Eliminar la cookie del refresh token
    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0)
    });

    return res;
}
