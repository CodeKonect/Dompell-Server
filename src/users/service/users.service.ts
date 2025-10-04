import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserUpdateDto } from '../dto/update_user.dto';
import { UserRepository } from 'src/repository/user.repository';
import { UsersQuery } from 'src/interfaces/user.model';

@Injectable()
export class UsersService extends UserRepository {
  async getAllUsers(query: UsersQuery) {
    const { search = '', role = '', page = 1, limit = 10 } = query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const where: { AND?: any[] } = {};

    if (search.trim()) {
      if (!where.AND) where.AND = [];
      where.AND.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (role && Object.values(Role).includes(role)) {
      if (!where.AND) where.AND = [];
      where.AND.push({ role: role });
    }

    if (where.AND && where.AND.length === 0) {
      delete where.AND;
    }

    const [total, users] = await this.$transaction([
      this.user.count({ where }),
      this.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          accountStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    if (!users || total === 0) {
      return { total: 0, users: [] };
    }

    return {
      total,
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  async findUserById(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async deletedUser(userId: string) {
    return await this.deleteUser(userId);
  }

  async updatedUser(userId: string, data: UserUpdateDto) {
    return this.updateUser(userId, data);
  }
}
