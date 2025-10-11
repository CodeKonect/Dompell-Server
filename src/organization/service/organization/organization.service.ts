import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationProfileDto } from 'src/organization/dto/create_update.dto';
import { OrganizationRepository } from 'src/repository/organization.repository';

@Injectable()
export class OrganizationService extends OrganizationRepository {
  public async getOrganizationProfile(id: string) {
    const organization = await this.getOrganizationById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  public async getOrganizationByUserId(userId: string) {
    const organization = await this.getOrganizationUser(userId);

    if (!organization) {
      throw new NotFoundException(`No organization found for user ${userId}`);
    }

    return organization;
  }

  public async getAllOrganizations() {
    return await this.getOrganizationUsers();
  }

  public async createOrUpdateOrganization(
    userId: string,
    data: OrganizationProfileDto,
  ) {
    return await this.createOrganization(userId, data);
  }

  public async deleteOrganization(id: string) {
    const organization = await this.getOrganizationById(id);

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return await super.deleteOrganization(id);
  }

  public async getOrganizationTrainingPrograms(orgId: string) {
    const programs = await this.getOrgTrainingPrograms(orgId);

    if (!programs.length) {
      throw new NotFoundException(
        `No training programs found for organization ${orgId}`,
      );
    }

    return programs;
  }
}
