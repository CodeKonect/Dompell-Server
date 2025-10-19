import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TraineeRepository } from '../../../repository/trainee.repository';
import { CertificationRepository } from '../../../repository/certification.repository';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from '../../dto/certification.dto';

@Injectable()
export class CertificationsService extends CertificationRepository{
  constructor(private tr: TraineeRepository) {
    super();
  }

  public async findAll(traineeProfileId: string) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }
    const certifications = await this.findByTraineeId(traineeProfileId);
    if (!certifications) {
      throw new NotFoundException('No certification found for this trainee');
    }

    return certifications;
  }

  public async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Certification Id is required');
    }

    const certification = await this.findById(id);
    if (!certification) {
      throw new NotFoundException('No certification found for this trainee');
    }

    return certification;
  }

  public async addCertification(
    data: CreateCertificationDto,
    traineeProfileId: string,
  ) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }

    const trainee = await this.tr.findByID(traineeProfileId);
    if (!trainee) {
      throw new NotFoundException('Trainee profile not found');
    }
    traineeProfileId = trainee.id;

    return await this.create(data, traineeProfileId);
  }

  public async updateCertification(id: string, data: UpdateCertificationDto) {
    if (!id) {
      throw new BadRequestException('Experience Id is required');
    }

    const certification = await this.findById(id);
    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    return await this.update(id, data);
  }

  async deleteCertification(id: string, traineeProfileId: string) {
    if (!id) {
      throw new BadRequestException('Certification Id is required');
    }
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }

    const certification = await this.findById(id);
    if (!certification) {
      throw new NotFoundException(
        `Certification record with ID ${id} not found.`,
      );
    }

    if (certification.traineeProfileId !== traineeProfileId) {
      throw new ForbiddenException(
        'Access denied. This certification record does not belong to your profile.',
      );
    }

    return this.delete(id);
  }
}
