import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

// Secreto para verificar la firma del JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secreto_super_seguro");

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/catalog');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  try {
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Si el usuario ya está validado, no lo dejamos volver al login o register
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/catalog', request.url));
      }

      // Validar ROL del usuario
      if (pathname.startsWith('/dashboard') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/catalog', request.url));
      }

      return NextResponse.next();
    }
  } catch (error) {
    // Access Token inválido, proceder a intentar refrescar
  }

  // Si no hay access token o es inválido, intentar refrescar
  if (refreshToken) {
    try {
      const { payload } = await jwtVerify(refreshToken, JWT_SECRET);

      if (pathname.startsWith('/dashboard') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/catalog', request.url));
      }

      const newAccessToken = await new SignJWT({ userId: payload.userId, role: payload.role, email: payload.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(JWT_SECRET);

      const response = NextResponse.next();
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60,
      });
      return response;
    } catch {
      // Refresh Token inválido
    }
  }

  // Si se intenta acceder a ruta protegida sin credenciales válidas
  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configuración de las rutas que el proxy debe interceptar
export const config = {
  matcher: ['/login', '/register', '/catalog/:path*', '/dashboard/:path*'],
};
