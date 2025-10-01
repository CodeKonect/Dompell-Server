import { Module } from '@nestjs/common';
import { AuthenticationService } from './service/authentication.service';

@Module({
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
