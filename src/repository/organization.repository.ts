import { DbConnectService } from 'src/db/db-connect.service';

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
    

}
