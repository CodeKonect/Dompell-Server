import { Module } from '@nestjs/common';
import { EmployerService } from './service/employer.service';
import { EmployerController } from './controller/employer.controller';
import { EmployerRepository } from '../repository/employer.repository';
import { AuthGuard } from '../guards/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { S3Service } from '../s3-bucket/service/s3.service';
import { UserRepository } from '../repository/user.repository';

@Module({
  imports: [JwtModule],
  providers: [
    EmployerService,
    EmployerRepository,
    AuthGuard,
    S3Service,
    UserRepository,
  ],
  controllers: [EmployerController],
})
export class EmployerModule {}
