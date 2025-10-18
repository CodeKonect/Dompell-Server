import { DbConnectService } from 'src/db/db-connect.service';

export class TraineeRepository extends DbConnectService {
  public async findByID(id: string) {
    const trainee = this.traineeProfile.findUnique({
      where: { id },
      include: {
        educations: true,
        experiences: true,
        certifications: true,
        portfolioProjects: true,
        skills: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return trainee;
  }
}
