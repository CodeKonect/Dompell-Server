import { Module } from '@nestjs/common';
import { TraineeService } from './service/trainee/trainee.service';
import { EducationService } from './service/education/education.service';
import { PortfolioService } from './service/portfolio/portfolio.service';
import { SkillsService } from './service/skills/skills.service';
import { ExperienceService } from './service/experience/experience.service';
import { TraineeController } from './controller/trainee/trainee.controller';
import { SkillsController } from './controller/skills/skills.controller';
import { S3Service } from 'src/s3-bucket/service/s3.service';
import { TraineeRepository } from 'src/repository/trainee.repository';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repository/user.repository';

@Module({
  imports: [JwtModule],
  providers: [
    TraineeService,
    EducationService,
    PortfolioService,
    SkillsService,
    ExperienceService,
    S3Service,
    TraineeRepository,
    AuthGuard,
    UserRepository,
  ],
  controllers: [TraineeController, SkillsController],
})
export class TraineeModule {}
