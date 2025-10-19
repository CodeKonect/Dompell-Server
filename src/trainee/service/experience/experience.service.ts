import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../../repository/experience.repository';
import { TraineeRepository } from '../../../repository/trainee.repository';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../../dto/experience.dto';

@Injectable()
export class ExperienceService extends ExperienceRepository {
  constructor(private tr: TraineeRepository) {
    super();
  }

  public async findAll(traineeProfileId: string) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }
    const experience = await this.findByTraineeId(traineeProfileId);
    if (!experience) {
      throw new NotFoundException('No experience found for this trainee');
    }

    return experience;
  }

  public async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Experience Id is required');
    }

    const experience = await this.findById(id);
    if (!experience) {
      throw new NotFoundException('No experience found for this trainee');
    }

    return experience;
  }

  public async addExperience(
    data: CreateExperienceDto,
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

  public async updateExperience(id: string, data: UpdateExperienceDto) {
    if (!id) {
      throw new BadRequestException('Experience Id is required');
    }

    const experience = await this.findById(id);
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return await this.update(id, data);
  }

  async deleteExperience(id: string, traineeProfileId: string) {
    if (!id) {
      throw new BadRequestException('Experience Id is required');
    }
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }

    const experience = await this.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience record with ID ${id} not found.`);
    }

    if (experience.traineeProfileId !== traineeProfileId) {
      throw new ForbiddenException(
        'Access denied. This experience record does not belong to your profile.',
      );
    }

    return this.delete(id);
  }
}
