// src/services/lease.service.ts
import { prisma } from "@/lib/db";
import { LeaseStatus } from "@prisma/client";

export const leaseService = {
  
    // Crear Contrato
  async createLease(data: {
    propertyId: number;
    tenantId: number;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    status: LeaseStatus;
  }) {
    return await prisma.lease.create({
      data: {
        ...data,
        monthlyRent: data.monthlyRent,
      },
    });
  },

 // Obtiene todos los contratos
  async getAllLeases() {
    return await prisma.lease.findMany({
      include: {
        property: {
          select: { title: true, address: true }
        },
        tenant: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },


  async getLeaseById(id: number) {
    return await prisma.lease.findUnique({
      where: { id },
      include: {
        property: {
          select: { title: true, address: true }
        },
        tenant: {
          select: { name: true, email: true }
        }
      }
    });
  },

  async updateLease(id: number, data: {
    propertyId: number;
    tenantId: number;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    status: LeaseStatus;
  }) {
    return await prisma.lease.update({
      where: { id },
      data
    });
  },

// Actualiza el estado del contrato
  async updateLeaseStatus(id: number, status: LeaseStatus) {
    return await prisma.lease.update({
      where: { id },
      data: { status }
    });
  },

  async deleteLease(id: number) {
    return await prisma.lease.delete({
      where: { id }
    });
  }
};
