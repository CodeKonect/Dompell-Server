import { Role } from '@prisma/client';

export interface Register {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface Payload {
    id: string;
    email: string;
    role: Role;
}

export enum AuthToken {
    ACCESS_TOKEN = 'access-tk',
    REFRESH_TOKEN = 'refresh-tk',
}
