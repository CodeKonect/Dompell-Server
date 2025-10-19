import { Module } from '@nestjs/common';
import { TraineeService } from './service/trainee/trainee.service';
import { EducationService } from './service/education/education.service';
import { PortfolioService } from './service/portfolio/portfolio.service';
import { ExperienceService } from './service/experience/experience.service';
import { TraineeController } from './controller/trainee/trainee.controller';
import { S3Service } from 'src/s3-bucket/service/s3.service';
import { TraineeRepository } from 'src/repository/trainee.repository';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repository/user.repository';
import { EducationController } from './controller/education/education.controller';
import { ExperienceController } from './controller/experience/experience.controller';
import { CertificationsService } from './service/certifications/certifications.service';
import { CertificationsController } from './controller/certifications/certifications.controller';

@Module({
  imports: [JwtModule],
  providers: [
    TraineeService,
    EducationService,
    PortfolioService,
    ExperienceService,
    S3Service,
    TraineeRepository,
    AuthGuard,
    UserRepository,
    CertificationsService,
  ],
  controllers: [TraineeController, EducationController, ExperienceController, CertificationsController],
})
export class TraineeModule {}
