import { NextResponse } from "next/server";
import { propertyService } from "@/services/property.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const property = await propertyService.createProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 400 });
  }
}

export async function GET() {
  const properties = await propertyService.getAllProperties();
  return NextResponse.json(properties);
}
