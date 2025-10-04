import { DbConnectService } from '../db/db-connect.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getPasswordHash } from '../utils/auth.utils';
import { Register } from 'src/interfaces/auth.model';
import { Prisma } from '@prisma/client';

export class UserRepository {
  constructor(private readonly db: DbConnectService) {}

  public async getUserById(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        traineeProfile: true,
        employerProfile: true,
        organizationProfile: true,
        appointmentsReceived: true,
        appointmentsSent: true,
        messagesReceived: true,
        messagesSent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        password: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async checkExistingUser(email: string) {
    const existingUser = await this.db.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (!existingUser)
      throw new ConflictException('Email already exist, please login');
    return existingUser;
  }

  public async createUser(data: Register) {
    const hashedPassword = await getPasswordHash(data.password);
    const newUser = await this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return newUser;
  }

  public async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    const updateUser = await this.db.user.update({
      where: { id: userId },
      data: data,
    });

    return updateUser;
  }

  public async deleteUser(userId: string) {
    const deletedUser = await this.db.user.delete({
      where: { id: userId },
    });

    return deletedUser;
  }
}
