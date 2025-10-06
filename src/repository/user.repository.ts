import { DbConnectService } from '../db/db-connect.service';
import { getPasswordHash } from '../utils/auth.utils';
import { Register } from 'src/interfaces/auth.model';
import { Prisma } from '@prisma/client';

export class UserRepository extends DbConnectService {
  public async getUserById(id: string) {
    const user = await this.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        traineeProfile: true,
        employerProfile: true,
        institutionProfile: true,
        appointmentsReceived: true,
        appointmentsSent: true,
        messagesReceived: true,
        messagesSent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.user.findUnique({
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

    return user;
  }

  public async checkExistingUser(email: string) {
    const existingUser = await this.user.findUnique({
      where: { email },
      select: { email: true },
    });

    return !!existingUser;
  }

  public async createUser(data: Register) {
    const hashedPassword = await getPasswordHash(data.password);
    const newUser = await this.user.create({
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
    const updateUser = await this.user.update({
      where: { id: userId },
      data: data,
    });

    return updateUser;
  }

  public async deleteUser(userId: string) {
    return await this.user.delete({
      where: { id: userId },
    });
  }
}
