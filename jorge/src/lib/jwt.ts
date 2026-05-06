
import { SignJWT, jwtVerify } from 'jose';

const accessToken = new TextEncoder().encode(process.env.ACCESS_SECRET);
const refreshToken = new TextEncoder().encode(process.env.REFRESH_SECRET);

interface JWTPayload {
    id: number;
    email: string;
    role: 'ADMIN' | 'USER';
    [key: string]: any;
}

export async function generateAccessToken(payload: JWTPayload) {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(accessToken);
}

export async function generateRefreshToken(payload: JWTPayload) {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(refreshToken);
}

export async function validateAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, accessToken);
        return payload as unknown as JWTPayload;
    } catch (error) {
        return null;
    }
}

export async function validateRefreshToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, refreshToken);
        return payload as unknown as JWTPayload;
    } catch (error) {
        return null;
    }
}
