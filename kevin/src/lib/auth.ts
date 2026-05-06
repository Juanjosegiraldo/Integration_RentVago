// src/lib/auth.ts
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secreto_super_seguro");

export const authLib = {
  // Hashear contraseña
  hashPassword: (password: string) => bcrypt.hash(password, 10),

  // Comparar contraseña
  comparePassword: (password: string, hash: string) => bcrypt.compare(password, hash),

  // Generar Access Token (Dura 15 min)
  generateAccessToken: async (userId: number, role: UserRole | string, email: string) => {
    return await new SignJWT({ userId, role, email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(JWT_SECRET);
  },

  generateRefreshToken: async (userId: number, role: UserRole | string, email: string) => {
    return await new SignJWT({ userId, role, email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);
  }


};
