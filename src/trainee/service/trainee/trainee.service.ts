import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  traineeProfileInclude,
  TraineeRepository,
} from 'src/repository/trainee.repository';
import { S3Service } from 'src/s3-bucket/service/s3.service';
import { CreateTraineeProfileDto } from 'src/trainee/dto/trainee.dto';
import { UploadedFile } from 'src/utils/auth.utils';

export interface TraineeQuery {
  search?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class TraineeService extends TraineeRepository {
  constructor(private s3Service: S3Service) {
    super();
  }

  public async createProfile(
    data: CreateTraineeProfileDto,
    userId: string,
    cv?: UploadedFile,
    avatar?: UploadedFile,
  ) {
    if (!userId) {
      throw new BadRequestException(`User ID is required`);
    }

    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    userId = user.id;

    if (cv) {
      data.cvUrl = await this.s3Service.uploadFile(cv);
    }

    if (avatar) {
      data.profilePictureUrl = await this.s3Service.uploadFile(avatar);
    }

    return await this.create(data, userId);
  }

  public async getProfile(id: string) {
    if (!id) {
      throw new BadRequestException(`Trainee Profile ID is required`);
    }

    const profile = await this.findByID(id);
    if (!profile) {
      throw new NotFoundException('Trainee Profile not found');
    }

    return profile;
  }

  public async getProfileByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException(`User ID is required`);
    }

    const profile = await this.findByUserID(userId);
    if (!profile) {
      throw new NotFoundException('Trainee Profile not found');
    }

    return profile;
  }

  public async deleteProfile(id: string) {
    if (!id) {
      throw new BadRequestException(`Organization ID is required`);
    }

    const profile = await this.findByID(id);
    if (!profile) {
      throw new NotFoundException(`Trainee Profile ID not found`);
    }

    return await this.delete(id);
  }

  public async getAllTraineeProfiles(query: TraineeQuery) {
    const { search = '', skill = '', page = 1, limit = 10 } = query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const where: { AND?: any[] } = {};

    if (search.trim()) {
      if (!where.AND) where.AND = [];
      where.AND.push({
        OR: [
          { location: { contains: search, mode: 'insensitive' } },
          { headline: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (skill) {
      if (!where.AND) where.AND = [];
      where.AND.push({
        skills: {
          some: { name: { equals: skill, mode: 'insensitive' } },
        },
      });
    }

    if (where.AND && where.AND.length === 0) {
      delete where.AND;
    }

    const [total, trainees] = await this.$transaction([
      this.traineeProfile.count({ where }),
      this.traineeProfile.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: traineeProfileInclude,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    if (!trainees || total === 0) {
      return { total: 0, users: [] };
    }

    return {
      total,
      trainees,
      pagination: {
        currentPage: pageNum,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
