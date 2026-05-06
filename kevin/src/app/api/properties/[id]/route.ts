import { NextResponse } from "next/server";
import { propertyService } from "@/services/property.service";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await propertyService.getPropertyById(Number(id));
    
    if (!property) return NextResponse.json({ error: "No existe" }, { status: 404 });
    
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: "Error al consultar" }, { status: 400 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await propertyService.deleteProperty(Number(id));
    return NextResponse.json({ message: "Propiedad eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 400 });
  }
}
