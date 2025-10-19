import { Prisma } from '@prisma/client';
import { DbConnectService } from 'src/db/db-connect.service';
import { CreateTraineeProfileDto } from 'src/trainee/dto/trainee.dto';

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
    return this.traineeProfile.findUnique ({
      where: { id },
      include: traineeProfileInclude,
    });
  }

  public async findByUserID(userId: string) {
    return this.traineeProfile.findUnique ({
      where: { userId },
      include: traineeProfileInclude,
    });
  }

  public async create(data: CreateTraineeProfileDto, userId: string) {
    return this.traineeProfile.upsert ({
      where: { userId },
      update: {
        headline: data.headline,
        bio: data.bio,
        profilePictureUrl: data.profilePictureUrl,
        cvUrl: data.cvUrl,
        location: data.location,
      },
      create: {
        headline: data.headline,
        bio: data.bio,
        profilePictureUrl: data.profilePictureUrl,
        cvUrl: data.cvUrl,
        location: data.location,
        user: {
          connect: { id: userId },
        },
      },
      include: traineeProfileInclude,
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
