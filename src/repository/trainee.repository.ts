import { Prisma } from '@prisma/client';
import { DbConnectService } from 'src/db/db-connect.service';

export const traineeProfileInclude =
  Prisma.validator<Prisma.TraineeProfileInclude>()({
    educations: true,
    experiences: true,
    certifications: true,
    portfolioProjects: true,
    skills: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    enrollments: true,
  });

export class TraineeRepository extends DbConnectService {
  public async findByID(id: string) {
    const trainee = await this.traineeProfile.findUnique({
      where: { id },
      include: traineeProfileInclude,
    });

    return trainee;
  }

  public async findByUserID(userId: string) {
    return this.traineeProfile.findUnique({
      where: { userId },
      include: traineeProfileInclude,
    });
  }

  public async create(data: Prisma.TraineeProfileCreateInput) {
    return this.traineeProfile.create({
      data,
    });
  }

  public async update(id: string, data: Prisma.TraineeProfileUpdateInput) {
    return this.traineeProfile.update({
      where: { id },
      data,
    });
  }

  public async updateProfileCompletion(id: string, isComplete: boolean) {
    return this.traineeProfile.update({
      where: { id },
      data: { profileComplete: isComplete },
    });
  }

  public async delete(id: string) {
    return this.traineeProfile.delete({
      where: { id },
    });
  }
}
