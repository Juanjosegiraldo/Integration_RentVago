export type LeaseStatus = "ACTIVO" | "PENDIENTE" | "EXPIRADO";

export interface Lease {
  id: number;
  propertyId: number; 
  tenantId: number;   
  startDate: Date;
  endDate: Date;
  monthlyRent: number; 
  status: LeaseStatus;
}
