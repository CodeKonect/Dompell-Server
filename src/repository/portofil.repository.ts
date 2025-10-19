import { DbConnectService } from 'src/db/db-connect.service';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from '../trainee/dto/portfolio.dto';

export class PortfolioRepository extends DbConnectService {
  public async findByID(id: string) {
    return this.portfolioProject.findUnique({
      where: { id },
      include: { traineeProfile: true },
    });
  }

  public async create(data: CreatePortfolioDto, traineeProfileId: string) {
    return this.portfolioProject.create({
      data: {
        ...data,
        traineeProfile: {
          connect: { id: traineeProfileId },
        },
      },
    });
  }

  public async update(id: string, data: UpdatePortfolioDto) {
    return this.portfolioProject.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  public async findByTraineeProfileId(traineeProfileId: string) {
    return this.portfolioProject.findMany({
      where: { traineeProfileId },
    });
  }

  public async delete(id: string) {
    return this.portfolioProject.delete({ where: { id } });
  }
}
