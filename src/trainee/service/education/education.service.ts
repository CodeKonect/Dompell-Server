import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EducationRepository } from '../../../repository/education.repository';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from '../../dto/education.dto';
import { TraineeRepository } from '../../../repository/trainee.repository';

@Injectable()
export class EducationService extends EducationRepository {
  constructor(private tr: TraineeRepository) {
    super();
  }
  public async getAll(traineeProfileId: string) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }
    const educations = await this.findByTraineeProfileId(traineeProfileId);
    if (!educations) {
      throw new NotFoundException('No education found for this trainee');
    }

    return educations;
  }

  public async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Education Id is required');
    }

    const education = await this.findOne(id);
    if (!education) {
      throw new NotFoundException('No education found for this trainee');
    }
  }

  public async createEducation(
    data: CreateEducationDto,
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

  public async updateEducation(id: string, data: UpdateEducationDto) {
    if (!id) {
      throw new BadRequestException('Education Id is required');
    }

    const education = await this.findOne(id);
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return await this.update(id, data);
  }

  public async deleteEducation(id: string) {
    if (!id) {
      throw new BadRequestException('Education Id is required');
    }

    const education = await this.findOne(id);
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return await this.delete(id);
  }
}
