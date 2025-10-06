import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTrainingProgramDto } from 'src/organization/dto/training.dto';
import { OrganizationRepository } from 'src/repository/organization.repository';

@Injectable()
export class ProgramsService extends OrganizationRepository {
  public async createTrainingProgram(
    userId: string,
    data: CreateTrainingProgramDto,
  ) {
    const organization = await this.getOrganizationUser(userId);
    if (!organization) {
      throw new ForbiddenException(
        'You must create your organization profile before posting training programs.',
      );
    }

    const program = await this.trainingProgram.create({
      data: {
        title: data.title,
        description: data.description,
        keyLearningOutcomes: data.keyLearningOutcomes,
        duration: data.duration,
        associatedCertifications: data.associatedCertifications,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        eligibilityCriteria: data.eligibilityCriteria,
        applicationProcess: data.applicationProcess,
        brochureUrl: data.brochureUrl,
        institution: {
          connect: { id: organization.id },
        },
      },
    });

    return program;
  }

  public async getNewPrograms(userId: string) {
    const organization = await this.getOrganizationUser(userId);

    if (!organization) {
      throw new ForbiddenException(
        'organization profile not found. Please create one first.',
      );
    }

    const now = new Date();
    const programs = await this.trainingProgram.findMany({
      where: {
        institutionId: organization.id,
        startDate: { lte: now },
      },
      orderBy: { startDate: 'desc' },
    });

    return programs;
  }

  public async getUpcomingPrograms(userId: string) {
    const organization = await this.getOrganizationUser(userId);

    if (!organization) {
      throw new ForbiddenException(
        'organization profile not found. Please create one first.',
      );
    }

    const now = new Date();
    const programs = await this.trainingProgram.findMany({
      where: {
        institutionId: organization.id,
        startDate: { gt: now },
      },
      orderBy: { startDate: 'asc' },
    });

    return programs;
  }
}
