import { DbConnectService } from '../db/db-connect.service';
import { NotFoundException } from '@nestjs/common';
import { getPasswordHash } from '../utils/auth.utils';
import { Register } from 'src/interfaces/auth.model';

export class UserRepository {
    constructor(private readonly db: DbConnectService) {}

    async getUserById(id: string) {
        const user = await this.db.user.findUnique({
            where: { id },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async getUserByEmail(email: string) {
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

    async checkExistingUser(email: string) {
        const existingUser = await this.db.user.findUnique({
            where: { email },
        });
        if (!existingUser) throw new NotFoundException('User not found');
        return existingUser;
    }

    async createUser(data: Register) {
        await this.checkExistingUser(data.email);
        const hashedPassword = await getPasswordHash(data.password);

        await this.db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
        });
    }
}
