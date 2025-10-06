import { Module } from '@nestjs/common';
import { OrganizationService } from './service/organization/organization.service';
import { ProgramsService } from './service/programs/programs.service';
import { ProgramsController } from './controller/programs/programs.controller';
import { OrganizationController } from './controller/organization/organization.controller';

@Module({
  providers: [OrganizationService, ProgramsService],
  controllers: [OrganizationController, ProgramsController],
})
export class OrganizationModule {}
