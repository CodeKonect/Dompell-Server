import { DbConnectService } from 'src/db/db-connect.service';
import { OrganizationProfileDto } from 'src/organization/dto/create_update.dto';

export class OrganizationRepository extends DbConnectService {
  public async getOrganizationById(id: string) {
    const organization = await this.institutionProfile.findUnique({
      where: { id },
      include: {
        user: true,
        trainingPrograms: true,
        invitationsSent: true,
      },
    });

    return organization;
  }

  public async getOrganizationUser(userId: string) {
    const organization = await this.institutionProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        trainingPrograms: true,
        invitationsSent: true,
      },
    });

    return organization;
  }

  public async getOrganizationUsers() {
    const organizations = await this.institutionProfile.findMany({
      include: {
        user: true,
        trainingPrograms: true,
        invitationsSent: true,
      },
    });

    return organizations;
  }

  public async createOrganization(
    userId: string,
    data: OrganizationProfileDto,
  ) {
    const upsertOrganization = await this.institutionProfile.upsert({
      where: { userId },
      update: {
        institutionName: data.institutionName,
        institutionType: data.institutionType,
        description: data.description,
        missionVision: data.missionVision,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        accreditationDetails: data.accreditationDetails,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      },
      create: {
        institutionName: data.institutionName,
        institutionType: data.institutionType,
        description: data.description,
        missionVision: data.missionVision,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        accreditationDetails: data.accreditationDetails,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true,
      },
    });

    return upsertOrganization;
  }

  public async deleteOrganization(id: string) {
    return await this.institutionProfile.delete({
      where: { id },
    });
  }

  public async getOrgTrainingPrograms(id: string) {
    const organization = await this.institutionProfile.findUnique({
      where: { id },
      include: {
        trainingPrograms: true,
      },
    });

    return organization?.trainingPrograms || [];
  }
}
