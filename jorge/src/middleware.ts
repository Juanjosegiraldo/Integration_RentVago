import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from './lib/jwt';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const method = req.method;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const user = await validateAccessToken(token);
    if (!user) {
        return NextResponse.json({ message: 'Sesión expirada' }, { status: 401 });
    }

    const isWriteAction = ['POST', 'PUT', 'DELETE'].includes(method);

    // Protección agents (igual que antes, no cambia)
    if (pathname.startsWith('/api/agents')) {
        if (isWriteAction && user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Acceso restringido a administradores' }, { status: 403 });
        }
    }

    // Protección scraping:
    // - Cualquier usuario autenticado puede ver fuentes y arrendamientos (GET)
    // - Solo ADMIN puede crear, editar, borrar fuentes y ejecutar el scraping
    if (pathname.startsWith('/api/scraping')) {
        // Ejecutar scraping siempre requiere ADMIN
        if (pathname.startsWith('/api/scraping/ejecutar') && user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Acceso restringido a administradores' }, { status: 403 });
        }

        // Cualquier write sobre fuentes requiere ADMIN
        if (pathname.startsWith('/api/scraping/fuentes') && isWriteAction && user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Acceso restringido a administradores' }, { status: 403 });
        }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', user.id.toString());
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ['/api/agents/:path*', '/api/admin/:path*', '/api/scraping/:path*'],
};
