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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExperienceService } from '../../service/experience/experience.service';
import { Roles } from '../../../guards/role/role.decorator';
import { Role } from '@prisma/client';
import { MessageInterceptor } from '../../../interceptors/message.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  accessDeniedResponse,
  unauthorizedResponse,
} from '../../../swagger/users.swagger';
import { AuthGuard } from '../../../guards/auth/auth.guard';
import { RolesGuard } from '../../../guards/role/roles.guard';
import { DataMessageInterceptor } from '../../../interceptors/data-message.interceptor';
import {
  CreateExperienceDto,
  UpdateExperienceDto,
} from '../../dto/experience.dto';

@ApiTags('Trainee Experience')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('trainee/experience')
export class ExperienceController {
  constructor(private readonly ex: ExperienceService) {}

  @Get(':traineeProfileId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched experiences successfully')
  @ApiOperation({
    summary: 'Get a trainee experiences',
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
      message: 'Experience not found',
    },
  })
  async getExperiences(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
  ) {
    return await this.ex.findAll(traineeProfileId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched experience successfully')
  @ApiOperation({
    summary: 'Get a trainee experience',
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
      message: 'Experience not found',
    },
  })
  async getTraineeExperience(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ex.getById(id);
  }

  @Post('create/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Experience added successfully')
  @ApiOperation({ summary: 'Create a trainee experience profile' })
  @ApiBody({
    description: 'Trainee experience profile data',
    type: CreateExperienceDto,
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
  async createExperience(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
    @Body() data: CreateExperienceDto,
  ) {
    return await this.ex.addExperience(data, traineeProfileId);
  }

  @Patch(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Experience updated successfully')
  @ApiOperation({ summary: 'Update a trainee experience profile' })
  @ApiBody({
    description: 'Trainee experience data',
    type: UpdateExperienceDto,
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
  async updateExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateExperienceDto,
  ) {
    return await this.ex.updateExperience(id, data);
  }

  @Delete(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted trainee experience successfully')
  @ApiOperation({
    summary: 'Delete a trainee experience',
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
  async deleteExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { traineeProfileId: string },
  ) {
    return await this.ex.deleteExperience(id, body.traineeProfileId);
  }
}
