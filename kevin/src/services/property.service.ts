// src/services/property.service.ts
import { prisma } from "@/lib/db";
import { PropertyType } from "@prisma/client";

export const propertyService = {

    // Crear propiedad
  async createProperty(data: {
    title: string;
    address: string;
    type: PropertyType;
    price: number;
    ownerId: number;
    description?: string;
    imageUrl?: string;
  }) {
    return await prisma.property.create({
      data: {
        ...data,
        price: data.price, 
      },
    });
  },

  async getPropertyById(id: number) {
    return await prisma.property.findUnique({
      where: { id },
      include: { owner: true }
    });
  },

  async updateProperty(id: number, data: Partial<{
    title: string;
    address: string;
    type: PropertyType;
    price: number;
    ownerId: number;
    description: string;
    imageUrl: string;
  }>) {
    return await prisma.property.update({
      where: { id },
      data
    });
  },

// Obtiene todas las propiedades con la informacion del dueno
  async getAllProperties() {
    return await prisma.property.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },


  // Elimina una propiedad
  async deleteProperty(id: number) {
    return await prisma.property.delete({
      where: { id }
    });
  }
};
