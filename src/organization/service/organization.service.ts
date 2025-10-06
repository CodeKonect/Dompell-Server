import { Injectable, NotFoundException } from '@nestjs/common';
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
}
