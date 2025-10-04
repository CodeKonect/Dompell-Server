import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

const role_keys: string = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(role_keys, roles);
