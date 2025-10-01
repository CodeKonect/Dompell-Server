import { Role } from '@prisma/client';

export interface Register {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Payload {
  id: string;
  email: string;
  role: Role;
}

export enum AuthToken {
  ACCESS_TOKEN = 'access-tk',
  REFRESH_TOKEN = 'refresh-tk',
}

export interface JwtTokenPayload {
  sub: string;
  token: AuthToken;
  exp: number;
}

export interface ForgetEmail {
  email: string;
  token: string;
  name: string;
}

export interface VerifyEmail {
  email: string;
  code: string;
  name: string;
}
