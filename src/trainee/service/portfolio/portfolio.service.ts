import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PortfolioRepository } from '../../../repository/portofil.repository';
import { TraineeRepository } from '../../../repository/trainee.repository';
import { UploadedFile } from '../../../utils/auth.utils';
import { S3Service } from '../../../s3-bucket/service/s3.service';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from '../../dto/portfolio.dto';

@Injectable()
export class PortfolioService extends PortfolioRepository {
  constructor(
    private tr: TraineeRepository,
    private readonly s3Service: S3Service,
  ) {
    super();
  }

  public async findAll(traineeProfileId: string) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }
    const projects = await this.findByTraineeProfileId(traineeProfileId);
    if (!projects) {
      throw new NotFoundException(
        'No portfolio projects found for this trainee',
      );
    }

    return projects;
  }

  public async getById(id: string) {
    if (!id) {
      throw new BadRequestException('Portfolio Project Id is required');
    }

    const project = await this.findByID(id);
    if (!project) {
      throw new NotFoundException(
        'No portfolio project found for this trainee',
      );
    }

    return project;
  }

  public async addPortfolio(
    data: CreatePortfolioDto,
    traineeProfileId: string,
    image?: UploadedFile,
  ) {
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }

    const trainee = await this.tr.findByID(traineeProfileId);
    if (!trainee) {
      throw new NotFoundException('Trainee profile not found');
    }
    traineeProfileId = trainee.id;

    if (image) {
      data.imageUrl = await this.s3Service.uploadFile(image);
    }

    return await this.create(data, traineeProfileId);
  }

  public async updatePortfolio(
    id: string,
    data: UpdatePortfolioDto,
    projectLink?: UploadedFile,
    image?: UploadedFile,
  ) {
    if (!id) {
      throw new BadRequestException('Experience Id is required');
    }

    const portfolio = await this.findByID(id);
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (projectLink) {
      data.projectUrl = await this.s3Service.uploadFile(projectLink);
    }

    if (image) {
      data.imageUrl = await this.s3Service.uploadFile(image);
    }

    return await this.update(id, data);
  }

  async deletePortfolio(id: string, traineeProfileId: string) {
    if (!id) {
      throw new BadRequestException('Portfolio Id is required');
    }
    if (!traineeProfileId) {
      throw new BadRequestException('Trainee profile Id is required');
    }

    const portfolio = await this.findByID(id);
    if (!portfolio) {
      throw new NotFoundException(`Portfolio record with ID ${id} not found.`);
    }

    if (portfolio.traineeProfileId !== traineeProfileId) {
      throw new ForbiddenException(
        'Access denied. This portfolio record does not belong to your profile.',
      );
    }

    return this.delete(id);
  }
}
