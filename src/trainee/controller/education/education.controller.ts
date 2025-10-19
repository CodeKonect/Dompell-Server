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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../guards/auth/auth.guard';
import { RolesGuard } from '../../../guards/role/roles.guard';
import { EducationService } from '../../service/education/education.service';
import { Roles } from '../../../guards/role/role.decorator';
import { Role } from '@prisma/client';
import { DataMessageInterceptor } from '../../../interceptors/data-message.interceptor';
import {
  accessDeniedResponse,
  unauthorizedResponse,
} from '../../../swagger/users.swagger';
import {
  CreateEducationDto,
  UpdateEducationDto,
} from '../../dto/education.dto';
import { MessageInterceptor } from '../../../interceptors/message.interceptor';

@ApiTags('Trainee Education')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('trainee/education')
export class EducationController {
  constructor(private readonly eds: EducationService) {}

  @Get(':traineeProfileId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched educations successfully')
  @ApiOperation({
    summary: 'Get a trainee educations',
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
      message: 'Education not found',
    },
  })
  async getEducations(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
  ) {
    return await this.eds.getAll(traineeProfileId);
  }

  @Post('create/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Education added successfully')
  @ApiOperation({ summary: 'Create a trainee education profile' })
  @ApiBody({
    description: 'Trainee education profile data',
    type: CreateEducationDto,
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
  async createEducation(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
    @Body() data: CreateEducationDto,
  ) {
    return await this.eds.createEducation(data, traineeProfileId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched education successfully')
  @ApiOperation({
    summary: 'Get a trainee education',
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
      message: 'Education not found',
    },
  })
  async getTraineeEducation(@Param('id', ParseUUIDPipe) id: string) {
    return await this.eds.getById(id);
  }

  @Patch(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Education updated successfully')
  @ApiOperation({ summary: 'Update a trainee education profile' })
  @ApiBody({
    description: 'Trainee education data',
    type: UpdateEducationDto,
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
  async updateEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateEducationDto,
  ) {
    return await this.eds.updateEducation(id, data);
  }

  @Delete(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted trainee education successfully')
  @ApiOperation({
    summary: 'Delete a trainee education profile',
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
  async deleteEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { traineeProfileId: string },
  ) {
    return await this.eds.deleteEducation(id, body.traineeProfileId);
  }
}
