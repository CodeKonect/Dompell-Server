import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TraineeRepository } from 'src/repository/trainee.repository';
import { S3Service } from 'src/s3-bucket/service/s3.service';
import { CreateTraineeProfileDto } from 'src/trainee/dto/trainee.dto';
import { UploadedFile } from 'src/utils/auth.utils';

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
      const cvUrl = await this.s3Service.uploadFile(cv);
      data.cvUrl = cvUrl;
    }

    if (avatar) {
      const avatarUrl = await this.s3Service.uploadFile(avatar);
      data.profilePictureUrl = avatarUrl;
    }

    return await this.createProfile(data, user);
  }
}
