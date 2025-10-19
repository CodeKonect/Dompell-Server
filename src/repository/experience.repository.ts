import { DbConnectService } from '../db/db-connect.service';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../trainee/dto/experience.dto';

export class ExperienceRepository extends DbConnectService {
  public findOne(id: string) {
    return this.experience.findUnique({
      where: { id },
      include: {
        traineeProfile: true,
      },
    });
  }

  public create(data: CreateExperienceDto, traineeProfileId: string) {
    return this.experience.create({
      data: {
        ...data,
        traineeProfile: {
          connect: { id: traineeProfileId },
        },
      },
    });
  }

  public update(id: string, data: UpdateExperienceDto) {
    return this.experience.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  public findByTraineeProfileId(traineeProfileId: string) {
    return this.education.findMany({
      where: { traineeProfileId },
      orderBy: { startDate: 'desc' },
      include: { traineeProfile: true },
    });
  }

  public async delete(id: string) {
    return this.experience.delete({ where: { id } });
  }
}
