"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { leaseSchema, loginSchema, propertySchema, registerSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { authLib } from "@/lib/auth";
import { adminService } from "@/services/admin.service";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { propertyService } from "@/services/property.service";
import { leaseService } from "@/services/lease.service";


export async function loginAction(_prevState: unknown, formData: FormData) {
  // 1. Extraer datos del formulario
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 2. Validar con Zod
  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: "Datos inválidos",
      details: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Buscar usuario en la DB
  const user = await prisma.user.findUnique({
    where: { email: validation.data.email },
  });

  if (!user) {
    return { error: "Credenciales inválidas" };
  }

  // 4. Comparar contraseña
  const isValid = await authLib.comparePassword(
    validation.data.password,
    user.password
  );
  if (!isValid) {
    return { error: "Credenciales inválidas" };
  }

  // 5. Generar tokens y guardarlos en cookies
  const accessToken = await authLib.generateAccessToken(user.id, user.role, user.email);
  const refreshToken = await authLib.generateRefreshToken(user.id, user.role, user.email);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });


  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect("/dashboard");
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  // 1. Extraer datos
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 2. Validar con Zod
  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: "Datos inválidos",
      details: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Hashear y crear usuario
  const hashedPassword = await authLib.hashPassword(validation.data.password);
  await prisma.user.create({
    data: {
      email: validation.data.email,
      name: validation.data.name,
      password: hashedPassword,
    },
  });

  return { success: true };
}

export async function toggleUserStatusAction(userId: number, isActive: boolean) {
  await adminService.toggleUserStatus(userId, !isActive);
  revalidatePath("/dashboard/users");
}

export async function changeUserRoleAction(userId: number, currentRole: string) {
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
  await adminService.updateUserRole(userId, newRole as UserRole);
  revalidatePath("/dashboard/users");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/");
}

// Al final de src/app/actions/db-actions.ts

export async function createPropertyAction(formData: FormData) {
  "use server"; // Esto indica que se ejecuta en el servidor

  const rawData = {
    title: formData.get("title") as string,
    address: formData.get("address") as string,
    type: formData.get("type") as any, // CASA o APARTAMENTO
    price: Number(formData.get("price")),
    ownerId: Number(formData.get("ownerId")),
    description: (formData.get("description") as string) || undefined,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
  };

  const validation = propertySchema.safeParse(rawData);
  if (!validation.success) {
    throw new Error("Datos inválidos para crear la propiedad");
  }

  await propertyService.createProperty(validation.data);

  revalidatePath("/dashboard/properties"); // Para que se refresque la lista
  redirect("/dashboard/properties"); // Te devuelve a la lista
}

export async function deletePropertyAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await propertyService.deleteProperty(id);

  revalidatePath("/dashboard/properties");
}

export async function updatePropertyAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  const rawData = {
    title: formData.get("title") as string,
    address: formData.get("address") as string,
    type: formData.get("type") as any,
    price: Number(formData.get("price")),
    ownerId: Number(formData.get("ownerId")),
    description: (formData.get("description") as string) || undefined,
    imageUrl: (formData.get("imageUrl") as string) || undefined,
  };

  const validation = propertySchema.safeParse(rawData);
  if (!validation.success) {
    throw new Error("Datos inválidos para actualizar la propiedad");
  }

  await propertyService.updateProperty(id, validation.data);

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${id}/edit`);

  redirect("/dashboard/properties");
}

export async function createLeaseAction(formData: FormData) {
  "use server";

  const rawData = {
    propertyId: Number(formData.get("propertyId")),
    tenantId: Number(formData.get("tenantId")),
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    monthlyRent: Number(formData.get("monthlyRent")),
    status: formData.get("status") as any,
  };

  const validation = leaseSchema.safeParse(rawData);
  if (!validation.success) {
    throw new Error("Datos inválidos para crear el arriendo");
  }

  await leaseService.createLease(validation.data);

  revalidatePath("/dashboard/leases");
  redirect("/dashboard/leases");
}

export async function updateLeaseAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  const rawData = {
    propertyId: Number(formData.get("propertyId")),
    tenantId: Number(formData.get("tenantId")),
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    monthlyRent: Number(formData.get("monthlyRent")),
    status: formData.get("status") as any,
  };

  const validation = leaseSchema.safeParse(rawData);
  if (!validation.success) {
    throw new Error("Datos inválidos para actualizar el arriendo");
  }

  await leaseService.updateLease(id, validation.data);

  revalidatePath("/dashboard/leases");
  redirect("/dashboard/leases");
}

export async function deleteLeaseAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await leaseService.deleteLease(id);

  revalidatePath("/dashboard/leases");
}
