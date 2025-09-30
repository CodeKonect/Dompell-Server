import { Role } from '@prisma/client';

export interface Register {
    name: string;
    email: string;
    password: string;
    role: Role;
}
