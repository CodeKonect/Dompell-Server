import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UsersController } from './controller/users.controller';
import { UserRepository } from 'src/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [UsersService, AuthGuard, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
