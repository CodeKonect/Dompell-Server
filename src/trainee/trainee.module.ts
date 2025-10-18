import { Module } from '@nestjs/common';
import { TraineeService } from './service/trainee/trainee.service';
import { EducationService } from './service/education/education.service';
import { PortfolioService } from './service/portfolio/portfolio.service';
import { SkillsService } from './service/skills/skills.service';
import { ExperienceService } from './service/experience/experience.service';

@Module({
  providers: [TraineeService, EducationService, PortfolioService, SkillsService, ExperienceService]
})
export class TraineeModule {}
