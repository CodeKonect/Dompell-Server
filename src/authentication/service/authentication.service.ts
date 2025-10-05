import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { RegisterDto } from '../dto/register.dto';
import {
  generateCode,
  generateToken,
  getPasswordHash,
  loginToken,
  verifyPassword,
} from 'src/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import { loginDto } from '../dto/login.dto';
import { AuthToken, JwtTokenPayload } from 'src/interfaces/auth.model';
import { MailService } from 'src/mail/service/mail.service';
import { ResetPasswordDto } from '../dto/reset.dto';

@Injectable()
export class AuthenticationService {
  protected readonly secretKey: string | undefined;

  public constructor(
    private userRepo: UserRepository,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {
    this.secretKey = this.config.get<string>('JWT_SECRET');
  }

  public async register(user: RegisterDto) {
    const existingUser = await this.userRepo.checkExistingUser(user.email);
    if (existingUser) {
      throw new ConflictException('Email already exist, please login');
    }
    const newUser = await this.userRepo.createUser(user);

    const optCode = generateCode();
    const tokenDuration = '15m';

    const token = this.jwt.sign(
      { sub: newUser.email, code: optCode },
      { expiresIn: tokenDuration, secret: this.secretKey },
    );

    await this.mail.sendVerificationEmail({
      email: newUser.email,
      code: optCode,
      name: newUser.name,
    });

    return { token };
  }

  public async login(user: loginDto) {
    const foundUser = await this.userRepo.getUserByEmail(user.email);
    if (!foundUser) {
      throw new NotFoundException('Invalid email or password');
    }
    const validPassword = await verifyPassword(
      user.password,
      foundUser.password,
    );
    if (!validPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    if (foundUser.accountStatus !== AccountStatus.VERIFIED) {
      throw new UnauthorizedException(
        'Please verify your account before you can login',
      );
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    };
    const token = loginToken(payload, this.jwt, this.config);
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

  public async verifyAccount(code: string, token: string) {
    if (!code) throw new BadRequestException('Code is required');

    const payload = this.jwt.verify<JwtTokenPayload>(token, {
      secret: this.secretKey,
    });
    if (!payload) throw new BadRequestException('token is required');

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      throw new BadRequestException('Invalid token or token expired');
    }

    const user = await this.userRepo.getUserByEmail(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.accountStatus === AccountStatus.VERIFIED) {
      throw new BadRequestException('Account already verified');
    }

    return await this.userRepo.updateUser(user.id, {
      accountStatus: AccountStatus.VERIFIED,
    });
  }

  public async forgotPassword(email: string) {
    try {
      const user = await this.userRepo.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const token = generateToken(user, this.jwt, this.config);

      return await this.mail.sendForgotPasswordEmail({
        email,
        token,
        name: user.name,
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Something went wrong, try again later',
      );
    }
  }

  public async resetPassword(user: ResetPasswordDto, token: string) {
    try {
      const payload = this.jwt.verify<JwtTokenPayload>(token, {
        secret: this.secretKey,
      });
      const existingUser = await this.userRepo.getUserByEmail(payload.sub);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const hashedPassword = await getPasswordHash(user.newPassword);

      return await this.userRepo.updateUser(existingUser.id, {
        password: hashedPassword,
      });
    } catch (error: unknown) {
      const err = error as Error;
      throw new BadRequestException(`Invalid token, ${err.message}`);
    }
  }

  public async resendCode(email: string) {
    try {
      const user = await this.userRepo.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const code = generateCode();
      return await this.mail.sendVerificationEmail({
        email: user.email,
        code,
        name: user.name,
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  public async resendMail(email: string) {
    try {
      const user = await this.userRepo.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const token = generateToken(user, this.jwt, this.config);

      return this.mail.sendForgotPasswordEmail({
        email,
        token,
        name: user.name,
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }

  public async refreshToken(refreshToken: string) {
    const payload = this.jwt.verify<JwtTokenPayload>(refreshToken, {
      secret: this.secretKey,
    });
    const user = await this.userRepo.getUserById(payload.sub);

    const accessDuration = '1h';
    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        role: user.role,
        token: AuthToken.ACCESS_TOKEN,
      },
      { expiresIn: accessDuration, secret: this.secretKey },
    );

    return { accessToken };
  }
}
