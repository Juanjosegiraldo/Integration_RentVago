import { prisma } from "@/lib/db";
import { UserRole, LeaseStatus } from "@prisma/client";

export const adminService = {
  // Obtiene estadísticas básicas para las tarjetas de resumen
  async getStats() {
    const [totalUsers, totalProperties, totalLeases] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.property.count(),
      prisma.lease.count({ where: { status: LeaseStatus.ACTIVO } })
    ]);

    return {
      activeUsers: totalUsers,
      totalProperties,
      totalLeases,
    };
  },

  // Obtiene datos detallados para las gráficas de Recharts
  async getDashboardMetrics() {
    const [propertyTypes, userTrend, leaseStatus] = await Promise.all([
      // 1. Distribución por tipo de propiedad (CASA vs APARTAMENTO)
      prisma.property.groupBy({
        by: ['type'],
        _count: true,
      }),
      // 2. Tendencia de registro de usuarios (agrupados por fecha de creación)
      prisma.user.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      // 3. Estado de los arriendos (ACTIVO, PENDIENTE, EXPIRADO)
      prisma.lease.groupBy({
        by: ['status'],
        _count: true,
      })
    ]);

    // Procesar tendencia de usuarios (Agrupar por mes)
    const userGroups: { [key: string]: number } = {};
    userTrend.forEach(user => {
      const month = user.createdAt.toLocaleDateString('es-ES', { month: 'short' });
      userGroups[month] = (userGroups[month] || 0) + 1;
    });

    return {
      propertyData: propertyTypes.map(p => ({
        name: p.type,
        value: p._count
      })),
      userData: Object.entries(userGroups).map(([name, count]) => ({
        name,
        usuarios: count
      })),
      leaseData: leaseStatus.map(l => ({
        name: l.status,
        value: l._count
      }))
    };
  },

  // Listar todos los usuarios
  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });
  },

  // Cambia el estado de activación de un usuario
  async toggleUserStatus(userId: number, isActive: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
  },

  // Cambia el rol de un usuario
  async updateUserRole(userId: number, role: UserRole) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
  },
};
