export type UserRole = "ADMIN" | "USER";

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}