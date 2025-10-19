import { DbConnectService } from '../db/db-connect.service';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from '../trainee/dto/certification.dto';

export class CertificationRepository extends DbConnectService {
  public async findById(id: string) {
    return this.certification.findUnique({
      where: { id },
      include: {
        traineeProfile: true,
      },
    });
  }

  public async create(data: CreateCertificationDto, traineeProfileId: string) {
    return this.certification.create({
      data: {
        ...data,
        traineeProfile: {
          connect: { id: traineeProfileId },
        },
      },
    });
  }

  public async update(id: string, data: UpdateCertificationDto) {
    return this.certification.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  public async findByTraineeId(traineeProfileId: string) {
    return this.certification.findMany({
      where: { traineeProfileId },
      include: { traineeProfile: true },
    });
  }

  public async delete(id: string) {
    return this.certification.delete({ where: { id } });
  }
}
