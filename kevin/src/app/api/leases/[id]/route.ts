// src/app/api/leases/[id]/route.ts
import { NextResponse } from "next/server";
import { leaseService } from "@/services/lease.service";
import { prisma } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    const updated = await leaseService.updateLeaseStatus(Number(id), status);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.lease.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Contrato eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 400 });
  }
}
