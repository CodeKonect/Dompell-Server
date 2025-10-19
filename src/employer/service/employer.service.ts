import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployerRepository } from '../../repository/employer.repository';
import { S3Service } from '../../s3-bucket/service/s3.service';
import { EmployerDto } from '../dto/create_update-employer.dto';
import { UploadedFile } from '../../utils/auth.utils';

@Injectable()
export class EmployerService extends EmployerRepository {
  constructor(private readonly s3Service: S3Service) {
    super();
  }
  public async createOrUpdateEmployerProfile(
    userId: string,
    data: EmployerDto,
    logo?: UploadedFile,
  ) {
    if (!userId) {
      throw new BadRequestException('User Id is required');
    }

    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    userId = user.id;

    if (logo) {
      data.logoUrl = await this.s3Service.uploadFile(logo);
    }

    return await this.createOrUpdateEmployer(userId, data);
  }

  public async getEmployerById(id: string) {
    if (!id) {
      throw new BadRequestException(`Employer ID is required`);
    }

    const employer = await this.getById(id);
    if (!employer) throw new NotFoundException('Employer not found');

    return employer;
  }

  public async getEmployerByUserID(userId: string) {
    if (!userId) {
      throw new BadRequestException('User Id is required');
    }

    const employer = await this.getByUser(userId);
    if (!employer)
      throw new ForbiddenException(
        'You do not have an employer profile yet. Please create one first.',
      );

    return employer;
  }

  public async getAllEmployers() {
    return this.getAll ();
  }

  public async deleteEmployerProfile(id: string) {
    if (!id) {
      throw new BadRequestException(`Employer ID is required`);
    }

    const employer = await this.getById(id);
    if (!employer) throw new NotFoundException('Employer not found');

    return await this.delete(id);
  }
}
