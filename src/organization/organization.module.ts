import { Module } from '@nestjs/common';
import { OrganizationService } from './service/organization/organization.service';
import { ProgramsService } from './service/programs/programs.service';

@Module({
  providers: [OrganizationService, ProgramsService],
})
export class OrganizationModule {}
