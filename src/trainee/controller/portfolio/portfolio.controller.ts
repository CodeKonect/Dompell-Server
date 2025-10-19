import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../guards/auth/auth.guard';
import { RolesGuard } from '../../../guards/role/roles.guard';
import { PortfolioService } from '../../service/portfolio/portfolio.service';
import { Roles } from '../../../guards/role/role.decorator';
import { Role } from '@prisma/client';
import { DataMessageInterceptor } from '../../../interceptors/data-message.interceptor';
import {
  accessDeniedResponse,
  unauthorizedResponse,
} from '../../../swagger/users.swagger';
import { MessageInterceptor } from '../../../interceptors/message.interceptor';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from '../../dto/portfolio.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Trainee Portfolio')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('trainee/portfolio')
export class PortfolioController {
  constructor(private readonly ps: PortfolioService) {}

  @Get(':traineeProfileId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched portfolio successfully')
  @ApiOperation({
    summary: 'Get a trainee portfolio',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: unauthorizedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      message: 'Portfolio not found',
    },
  })
  async getCertifications(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
  ) {
    return await this.ps.findAll(traineeProfileId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched portfolio successfully')
  @ApiOperation({
    summary: 'Get a trainee portfolio',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: unauthorizedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      message: 'Portfolio not found',
    },
  })
  async getTraineeCertification(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ps.getById(id);
  }

  @Post('create/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(
    DataMessageInterceptor,
    FileFieldsInterceptor([
      { name: 'projectLink', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @SetMetadata('message', 'Certification added successfully')
  @ApiOperation({ summary: 'Create a trainee certification profile' })
  @ApiBody({
    description: 'Trainee portfolio project data',
    type: CreatePortfolioDto,
  })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: unauthorizedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  async addPortfolio(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
    @Body() data: CreatePortfolioDto,
    @UploadedFiles()
    files: {
      projectLink?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const projectLink = files.projectLink?.[0];
    const image = files.image?.[0];

    return await this.ps.addPortfolio(
      data,
      traineeProfileId,
      projectLink,
      image,
    );
  }

  @Patch(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Portfolio updated successfully')
  @ApiOperation({ summary: 'Update a trainee portfolio project' })
  @ApiBody({
    description: 'Trainee portfolio project data',
    type: UpdatePortfolioDto,
  })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: unauthorizedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  async updatePortfolio(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdatePortfolioDto,
    @UploadedFiles()
    files: {
      projectLink?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    const projectLink = files.projectLink?.[0];
    const image = files.image?.[0];

    return await this.ps.updatePortfolio(id, data, projectLink, image);
  }

  @Delete(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted portfolio successfully')
  @ApiOperation({
    summary: 'Delete a trainee portfolio',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: unauthorizedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      message: 'Trainee profile not found',
    },
  })
  async deletePortfolio(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { traineeProfileId: string },
  ) {
    return await this.ps.deletePortfolio(id, body.traineeProfileId);
  }
}
