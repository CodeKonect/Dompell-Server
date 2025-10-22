import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployerService } from '../service/employer.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { RolesGuard } from '../../guards/role/roles.guard';
import { Roles } from '../../guards/role/role.decorator';
import { Role } from '@prisma/client';
import { DataMessageInterceptor } from '../../interceptors/data-message.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  accessDeniedResponse,
  unauthorizedResponse,
} from '../../swagger/users.swagger';
import { EmployerDto } from '../dto/create_update-employer.dto';

@ApiTags('Employer')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('employer')
export class EmployerController {
  constructor(private readonly es: EmployerService) {}

  @Post('create/:userId')
  @Roles(Role.EMPLOYER)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor, FileInterceptor('logo'))
  @SetMetadata('message', 'Employer Profile added successful')
  @ApiOperation({ summary: 'Create or update an employer profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Employer profile data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        industry: { type: 'string' },
        description: { type: 'string' },
        website: { type: 'string' },
        location: { type: 'string' },
        logo: { type: 'string', format: 'binary' },
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
  async createEmployerProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: EmployerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
        fileIsRequired: false,
      }),
    )
    logo?: Express.Multer.File,
  ) {
    return await this.es.createOrUpdateEmployerProfile(userId, data, logo);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched employer successfully')
  @ApiOperation({
    summary: 'Get an employer',
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
      message: 'employer not found',
    },
  })
  async getEmployerByID(@Param('id', ParseUUIDPipe) id: string) {
    return await this.es.getEmployerById(id);
  }

  @Get(':userId')
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.TRAINEE, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched employer successfully')
  @ApiOperation({
    summary: 'Get an employer',
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
      message: 'Employer not found',
    },
  })
  async getEmployerByUserID(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.es.getEmployerByUserID(userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTITUTION, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched employers successfully')
  @ApiOperation({
    summary: 'Get all employers',
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
      message: 'employer not found',
    },
  })
  async getAllEmployers() {
    return this.es.getAllEmployers();
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EMPLOYER)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched employer successfully')
  @ApiOperation({
    summary: 'Get an employer',
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
      message: 'employer not found',
    },
  })
  async deleteEmployerProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.es.deleteEmployerProfile(id);
  }
}
