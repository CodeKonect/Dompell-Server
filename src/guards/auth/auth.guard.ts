import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  AuthRequestProp,
  JwtTokenPayload,
  AuthToken,
} from 'src/interfaces/auth.model';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET') as string;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequestProp>();
    const token = this.extractTokenFromHeader(request);
    if (!token)
      throw new UnauthorizedException('Access denied, no token provided');

    try {
      const payload = this.jwtService.verify<JwtTokenPayload>(token, {
        secret: this.secret,
      });

      const user = await this.userRepo.getUserById(payload.sub);
      if (
        (user.accountStatus !== 'VERIFIED' && !user) ||
        payload.token !== AuthToken.ACCESS_TOKEN
      ) {
        throw new UnauthorizedException(
          'Role does not have the required privileges to access this resource',
        );
      }

      request.user = user;
      return true;
    } catch (error) {
      const err = error as Error;
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Your session has expired. Please log in again.',
        );
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Your token is invalid.');
      }

      throw new UnauthorizedException(
        err.message || 'Access denied, no token provided',
      );
    }
  }

  private extractTokenFromHeader(request: AuthRequestProp): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
