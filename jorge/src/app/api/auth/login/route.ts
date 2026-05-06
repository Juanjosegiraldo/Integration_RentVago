import { LoginUser } from "@/services/loginUser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { message: "Campos requeridos" },
                { status: 400 }
            );
        }
        const user = await LoginUser({ email, password });


        const res = NextResponse.json({
            message: "Login correcto",
            accessToken: user.accessToken,
            user: user.user
        });

        res.cookies.set("refreshToken", user.refreshToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return res;

    } catch (error: unknown) {

        const message = error instanceof Error ? error.message : "Error inesperado";

        return NextResponse.json(
            { message },
            { status: 401 }
        );
    }
}