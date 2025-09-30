import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { generateCode } from 'src/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
}
