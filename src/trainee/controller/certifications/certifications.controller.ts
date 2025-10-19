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
import { CertificationsService } from '../../service/certifications/certifications.service';
import { Roles } from '../../../guards/role/role.decorator';
import { Role } from '@prisma/client';
import { DataMessageInterceptor } from '../../../interceptors/data-message.interceptor';
import {
  accessDeniedResponse,
  unauthorizedResponse,
} from '../../../swagger/users.swagger';
import { MessageInterceptor } from '../../../interceptors/message.interceptor';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from '../../dto/certification.dto';

@ApiTags('Trainee Certification')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('trainee/certification')
export class CertificationsController {
  constructor(private readonly cs: CertificationsService) {}

  @Get(':traineeProfileId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched certification successfully')
  @ApiOperation({
    summary: 'Get a trainee certification',
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
      message: 'Certification not found',
    },
  })
  async getCertifications(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
  ) {
    return await this.cs.findAll(traineeProfileId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched certification successfully')
  @ApiOperation({
    summary: 'Get a trainee certification',
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
      message: 'Certification not found',
    },
  })
  async getTraineeCertification(@Param('id', ParseUUIDPipe) id: string) {
    return await this.cs.getById(id);
  }

  @Post('create/:traineeProfileId')
  @Roles(Role.TRAINEE)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Certification added successfully')
  @ApiOperation({ summary: 'Create a trainee certification profile' })
  @ApiBody({
    description: 'Trainee certification profile data',
    type: CreateCertificationDto,
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
  async createCertification(
    @Param('traineeProfileId', ParseUUIDPipe) traineeProfileId: string,
    @Body() data: CreateCertificationDto,
  ) {
    return await this.cs.addCertification(data, traineeProfileId);
  }

  @Patch(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Certification updated successfully')
  @ApiOperation({ summary: 'Update a trainee certification profile' })
  @ApiBody({
    description: 'Trainee certification data',
    type: UpdateCertificationDto,
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
  async updateCertification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCertificationDto,
  ) {
    return await this.cs.updateCertification(id, data);
  }

  @Delete(':id')
  @Roles(Role.TRAINEE)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted trainee certification successfully')
  @ApiOperation({
    summary: 'Delete a trainee certification',
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
  async deleteCertification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { traineeProfileId: string },
  ) {
    return await this.cs.deleteCertification(id, body.traineeProfileId);
  }
}
