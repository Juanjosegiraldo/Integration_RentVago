import { NextResponse } from "next/server";
import { leaseService } from "@/services/lease.service";

// Método GET para listar todos
export async function GET() {
  const leases = await leaseService.getAllLeases();
  return NextResponse.json(leases);
}

// Método POST para crear uno nuevo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLease = await leaseService.createLease({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
    return NextResponse.json(newLease, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el arrendamiento" }, { status: 400 });
  }
}
