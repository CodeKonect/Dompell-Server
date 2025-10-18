import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthToken, Payload } from 'src/interfaces/auth.model';

export const getPasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const loginToken = (
  user: Payload,
  jwt: JwtService,
  config: ConfigService,
) => {
  const secret = config.get<string>('JWT_SECRET');
  const accessDuration = config.get<string>('JWT_EXPIRATION');
  const refreshDuration = config.get<string>('JWT_REFRESH_EXPIRES');

  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      token: AuthToken.ACCESS_TOKEN,
    },
    { expiresIn: accessDuration, secret: secret },
  );
  const refreshToken = jwt.sign(
    { sub: user.id, token: AuthToken.REFRESH_TOKEN },
    { expiresIn: refreshDuration, secret: secret },
  );

  return { accessToken, refreshToken };
};

export const generateToken = (
  user: Payload,
  jwt: JwtService,
  config: ConfigService,
) => {
  const secret = config.get<string>('JWT_SECRET');
  const tokenDuration = '3h';

  return jwt.sign(
    { sub: user.email },
    { expiresIn: tokenDuration, secret: secret },
  );
};

export type UploadedFile = Express.Multer.File;
