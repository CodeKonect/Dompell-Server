import { DbConnectService } from '../db/db-connect.service';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../trainee/dto/experience.dto';

export class ExperienceRepository extends DbConnectService {
  public async findById(id: string) {
    return this.experience.findUnique({
      where: { id },
      include: {
        traineeProfile: true,
      },
    });
  }

  public async create(data: CreateExperienceDto, traineeProfileId: string) {
    return this.experience.create({
      data: {
        ...data,
        traineeProfile: {
          connect: { id: traineeProfileId },
        },
      },
    });
  }

  public async update(id: string, data: UpdateExperienceDto) {
    return this.experience.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  public async findByTraineeId(traineeProfileId: string) {
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
