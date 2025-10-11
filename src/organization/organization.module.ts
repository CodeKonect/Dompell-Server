import { Module } from '@nestjs/common';
import { OrganizationService } from './service/organization/organization.service';
import { ProgramsService } from './service/programs/programs.service';
import { ProgramsController } from './controller/programs/programs.controller';
import { OrganizationController } from './controller/organization/organization.controller';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { OrganizationRepository } from 'src/repository/organization.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repository/user.repository';
import { S3Service } from 'src/s3-bucket/service/s3.service';

@Module({
  imports: [JwtModule],
  providers: [
    OrganizationService,
    ProgramsService,
    AuthGuard,
    OrganizationRepository,
    UserRepository,
    S3Service,
  ],
  controllers: [OrganizationController, ProgramsController],
})
export class OrganizationModule {}
