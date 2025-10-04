import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const getAllResponse = {
  status: 200,
  message: 'Users fetched successfully',
  data: {
    total: 10,
    users: [
      {
        id: 'dea38495-3568-4ef5-980a-163501edc22d',
        name: 'John Doe',
        email: 'john@test.com',
        role: 'ADMIN',
        accountStatus: 'VERIFIED',
        createdAt: '2025-08-14T07:19:16.296Z',
        updatedAt: '2025-08-14T07:22:39.596Z',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: false,
    },
  },
};

export const unauthorizedResponse = {
  message: 'Role does not have the required privileges to access this resource',
  error: 'Unauthorized',
  statusCode: 401,
};

export const accessDeniedResponse = {
  message: 'Access denied, no token provided',
  error: 'Unauthorized',
  statusCode: 401,
};

export class UsersQueryDto {
  @ApiPropertyOptional({
    description: 'Search keyword for email, name, address, phone, or DOB',
  })
  search?: string;

  @ApiPropertyOptional({ enum: Role, description: 'Filter by role' })
  role?: Role;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 10,
  })
  limit?: number;
}

export const profileResponse = {
  status: 200,
  message: 'User fetched successfully',
  data: {
    id: 'dea38495-3568-4ef5-980a-163501edc22d',
    name: 'John Doe',
    email: 'john@test.com',
    role: 'ADMIN',
    accountStatus: 'VERIFIED',
    createdAt: '2025-08-14T07:19:16.296Z',
    updatedAt: '2025-08-14T07:22:39.596Z',
  },
};

export const updateUserResponse = {
  status: 200,
  message: 'User updated successfully',
  data: {
    id: '720f704c-82a8-43ee-a521-fc3e854494ab',
    name: 'Rachel Zain',
    email: 'beseki1588@blaxion.com',
    role: 'LEARNER',
    accountStatus: 'VERIFIED',
    createdAt: '2025-08-14T07:19:16.296Z',
    updatedAt: '2025-08-14T10:39:47.149Z',
  },
};
