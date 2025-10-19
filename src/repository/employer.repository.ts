import { DbConnectService } from 'src/db/db-connect.service';
import { EmployerDto } from '../employer/dto/create_update-employer.dto';
import { Prisma } from '@prisma/client';

export const employerInclude =
  Prisma.validator<Prisma.EmployerProfileInclude>()({
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    sentInvitations: true,
  });

export class EmployerRepository extends DbConnectService {
  public async getById(id: string) {
    return this.employerProfile.findUnique({
      where: { id },
      include: employerInclude,
    });
  }

  public async getByUser(userId: string) {
    return this.employerProfile.findUnique({
      where: { userId },
      include: employerInclude,
    });
  }

  public async getAll() {
    return this.employerProfile.findMany({
      include: employerInclude,
    });
  }

  public async createOrUpdateEmployer(userId: string, data: EmployerDto) {
    return this.employerProfile.upsert({
      where: { userId },
      update: {
        name: data.name,
        industry: data.industry,
        description: data.description,
        website: data.website,
        logoUrl: data.logoUrl,
        location: data.location,
      },
      create: {
        name: data.name,
        industry: data.industry,
        description: data.description,
        website: data.website,
        logoUrl: data.logoUrl,
        location: data.location,
        user: { connect: { id: userId } },
      },
    });
  }

  public async delete(id: string) {
    return this.employerProfile.delete({ where: { id } });
  }
}
