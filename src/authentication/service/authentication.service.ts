import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { generateCode, loginToken, verifyPassword } from 'src/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import { loginDto } from '../dto/login.dto';

@Injectable()
export class AuthenticationService {
    protected readonly secretKey: string | undefined;

    public constructor(
        private userRepo: UserRepository,
        private jwt: JwtService,
        private config: ConfigService,
    ) {
        this.secretKey = this.config.get<string>('JWT_SECRET');
    }

    protected async register(user: RegisterDto) {
        await this.userRepo.checkExistingUser(user.email);
        const newUser = await this.userRepo.createUser(user);

        const optCode = generateCode();
        const tokenDuration = '15m';

        const token = this.jwt.sign(
            { sub: newUser.email, code: optCode },
            { expiresIn: tokenDuration, secret: this.secretKey },
        );

        return { token };
    }

    protected async login(user: loginDto) {
        const foundUser = await this.userRepo.getUserByEmail(user.email);
        const validPassword = await verifyPassword(
            user.password,
            foundUser.password,
        );
        const isUserVerified = foundUser
            ? foundUser.accountStatus === AccountStatus.VERIFIED
            : false;

        if (!isUserVerified)
            throw new BadRequestException(
                'Please verify your account before you can login',
            );

        if (!validPassword)
            throw new BadRequestException('Invalid email or password');

        const token = loginToken(foundUser, this.jwt, this.config);
        return {
            user: {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
            },
            token,
        };
    }
}
