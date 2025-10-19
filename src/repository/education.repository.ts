import { DbConnectService } from '../db/db-connect.service';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from '../trainee/dto/education.dto';

export class EducationRepository extends DbConnectService {
  public async findOne(id: string) {
    return this.education.findUnique({
      where: { id },
      include: {
        traineeProfile: true,
      },
    });
  }

  public async create(education: CreateEducationDto, traineeProfileId: string) {
    return this.education.create({
      data: {
        ...education,
        traineeProfile: {
          connect: { id: traineeProfileId },
        },
      },
    });
  }

  public async update(id: string, data: UpdateEducationDto) {
    return this.education.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  public async findByTraineeProfileId(traineeProfileId: string) {
    return this.education.findMany({
      where: { traineeProfileId },
      orderBy: { startDate: 'desc' },
      include: { traineeProfile: true },
    });
  }

  public async delete(id: string) {
    return this.education.delete({ where: { id } });
  }
}
