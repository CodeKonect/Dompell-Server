import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationProfileDto } from 'src/organization/dto/create_update.dto';
import { OrganizationRepository } from 'src/repository/organization.repository';
import { S3Service } from 'src/s3-bucket/service/s3.service';
import { UploadedFile } from 'src/utils/auth.utils';

@Injectable()
export class OrganizationService extends OrganizationRepository {
  constructor(private s3Service: S3Service) {
    super();
  }

  public async getOrganizationProfile(id: string) {
    if (!id) {
      throw new BadRequestException(`User ID is required`);
    }

    const organization = await this.getOrganizationById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  public async getOrganizationByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException(`User ID is required`);
    }
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
    logo?: UploadedFile,
  ) {
    if (!userId) {
      throw new BadRequestException(`User ID is required`);
    }

    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    userId = user.id;

    if (logo) {
      data.logoUrl = await this.s3Service.uploadFile(logo);
    }

    return await this.createOrganization(userId, data);
  }

  public async deleteOrganization(id: string) {
    if (!id) {
      throw new BadRequestException(`Organization ID is required`);
    }

    const organization = await this.getOrganizationById(id);

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return await super.deleteOrganization(id);
  }

  public async getOrganizationTrainingPrograms(organizationId: string) {
    if (!organizationId) {
      throw new BadRequestException(`Organization ID is required`);
    }

    const programs = await this.getOrgTrainingPrograms(organizationId);

    if (!programs.length) {
      throw new NotFoundException(
        `No training programs found for organization ${organizationId}`,
      );
    }

    return programs;
  }
}
