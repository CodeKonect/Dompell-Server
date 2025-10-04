import { Module } from '@nestjs/common';
import { AuthenticationService } from './service/authentication.service';
import { AuthenticationController } from './controller/authentication.controller';
import { UserRepository } from 'src/repository/user.repository';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION', '30m'),
        },
      }),
    }),
  ],
  providers: [AuthenticationService, UserRepository],
  controllers: [AuthenticationController],
  exports: [JwtModule],
})
export class AuthenticationModule {}
