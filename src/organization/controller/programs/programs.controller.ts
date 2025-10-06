import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
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
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { DataMessageInterceptor } from 'src/interceptors/data-message.interceptor';
import { CreateTrainingProgramDto } from 'src/organization/dto/training.dto';
import { ProgramsService } from 'src/organization/service/programs/programs.service';
import {
  unauthorizedResponse,
  accessDeniedResponse,
} from 'src/swagger/users.swagger';

@ApiTags('Training Programs')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('programs')
export class ProgramsController {
  constructor(private ps: ProgramsService) {}

  @Post('create')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Training program created successfully')
  @ApiOperation({ summary: 'Post a new or upcoming training program' })
  @ApiBody({
    description: 'Training program request body',
    type: CreateTrainingProgramDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
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
      message:
        'You must create your organization profile before posting training programs.',
    },
  })
  async createTrainingProgram(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: CreateTrainingProgramDto,
  ) {
    return await this.ps.createTrainingProgram(userId, data);
  }

  @Get('new')
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched new training programs successfully')
  @ApiOperation({ summary: 'Get newly created or ongoing training programs' })
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
      message: 'organization profile not found. Please create one first.',
    },
  })
  async getNewPrograms(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.ps.getNewPrograms(userId);
  }

  @Get('upcoming')
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched upcoming training programs successfully')
  @ApiOperation({
    summary: 'Get upcoming training programs (future start date)',
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
      message: 'organization profile not found',
    },
  })
  async getUpcomingPrograms(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.ps.getUpcomingPrograms(userId);
  }
}
