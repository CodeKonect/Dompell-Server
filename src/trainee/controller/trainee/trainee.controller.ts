import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Get,
  Delete,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFiles,
  Query,
  Patch,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { DataMessageInterceptor } from 'src/interceptors/data-message.interceptor';
import { MessageInterceptor } from 'src/interceptors/message.interceptor';
import {
  unauthorizedResponse,
  accessDeniedResponse,
} from 'src/swagger/users.swagger';
import { CreateTraineeProfileDto } from 'src/trainee/dto/trainee.dto';
import {
  TraineeQuery,
  TraineeService,
} from 'src/trainee/service/trainee/trainee.service';
import { AddSkillDto, UpdateSkillsDto } from '../../dto/skills.dto';

@ApiTags('Trainee Profile')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('trainee')
export class TraineeController {
  constructor(private ts: TraineeService) {}

  @Post('create/:userId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(
    DataMessageInterceptor,
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
    ]),
  )
  @SetMetadata('message', 'Trainee Profile successful')
  @ApiOperation({ summary: 'Create or update a trainee profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Trainee profile data',
    schema: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        bio: { type: 'string' },
        location: { type: 'string' },
        cv: { type: 'string', format: 'binary' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
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
  async createTraineeProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFiles()
    files: { cv?: Express.Multer.File[]; avatar?: Express.Multer.File[] },
    @Body() data: CreateTraineeProfileDto,
  ) {
    if (files?.cv?.[0]) data.cvUrl = files.cv[0].path;
    if (files?.avatar?.[0]) data.profilePictureUrl = files.avatar[0].path;
    return await this.ts.createProfile(userId, data);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched trainee profile successfully')
  @ApiOperation({
    summary: 'Get a trainee profile',
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
  async getTraineeProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ts.getProfile(id);
  }

  @Get(':userId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched trainee profile successfully')
  @ApiOperation({
    summary: 'Get a trainee profile',
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
  async getTraineeProfileByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.ts.getProfileByUserId(userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted trainee profile successfully')
  @ApiOperation({
    summary: 'Delete a trainee profile',
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
  async deleteTraineeProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ts.deleteProfile(id);
  }

  @Get('')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Trainees fetched successfully')
  @ApiOperation({ summary: 'Get all trainees' })
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
  async getAllTrainees(@Query() query: TraineeQuery) {
    return await this.ts.getAllTraineeProfiles(query);
  }

  @Post('skill/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Skill added successfully')
  @ApiOperation({ summary: 'Add a trainee skill' })
  @ApiBody({
    description: 'Trainee skill profile data',
    type: AddSkillDto,
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
  async addSkill(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
    @Body() data: AddSkillDto,
  ) {
    return await this.ts.addSkill(traineeProfileId, data);
  }

  @Patch('skill/:id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Skill updated successfully')
  @ApiOperation({ summary: 'Update a trainee skill profile' })
  @ApiBody({
    description: 'Trainee skill data',
    type: UpdateSkillsDto,
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
  async updateSkill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSkillsDto,
  ) {
    return await this.ts.updateSkill(id, data);
  }

  @Delete('skill/:skillId/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted skill successfully')
  @ApiOperation({
    summary: 'Delete a trainee skill',
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
  async deleteSkill(
    @Param('skillId', ParseUUIDPipe) skillId: string,
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
  ) {
    return await this.ts.deleteSkill(skillId, traineeProfileId);
  }
}
