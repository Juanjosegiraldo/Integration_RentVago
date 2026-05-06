export type PropertyType= "CASA" | "Apartamento"

export interface Property {
  id: number;
  title: string;
  address: string;
  type: PropertyType;
  price: number; 
  ownerId: number; 
  description?: string;
  imageUrl?: string;
}