// src/lib/validations.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2, "Nombre muy corto"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const propertySchema = z.object({
  title: z.string().min(3, "Título muy corto"),
  address: z.string().min(5, "Dirección muy corta"),
  type: z.enum(["CASA", "APARTAMENTO"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  ownerId: z.number().int().positive(),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .trim()
    .url("La imagen debe ser una URL válida")
    .optional(),

});

export const leaseSchema = z.object({
  propertyId: z.number().int().positive(),
  tenantId: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  monthlyRent: z.number().positive(),
  status: z.enum(["ACTIVO", "PENDIENTE", "EXPIRADO"]),
}).refine((data) => data.endDate > data.startDate, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
});

