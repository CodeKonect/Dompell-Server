import { Role } from '@prisma/client';

export interface UsersQuery {
  search?: string;
  role?: Role;
  page?: number;
  limit?: number;
}
