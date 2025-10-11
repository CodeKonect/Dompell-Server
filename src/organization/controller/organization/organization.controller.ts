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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { DataMessageInterceptor } from 'src/interceptors/data-message.interceptor';
import { MessageInterceptor } from 'src/interceptors/message.interceptor';
import { OrganizationProfileDto } from 'src/organization/dto/create_update.dto';
import { OrganizationService } from 'src/organization/service/organization/organization.service';
import {
  unauthorizedResponse,
  accessDeniedResponse,
} from 'src/swagger/users.swagger';

@ApiTags('Organization')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private os: OrganizationService) {}

  @Post('create/:userId')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor, FileInterceptor('logo'))
  @SetMetadata('message', 'Organization created or updated successfully')
  @ApiOperation({ summary: 'Create or update an organization' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Organization data and logo file',
    schema: {
      type: 'object',
      properties: {
        institutionName: { type: 'string' },
        institutionType: { type: 'string' },
        description: { type: 'string' },
        missionVision: { type: 'string' },
        websiteUrl: { type: 'string' },
        accreditationDetails: { type: 'string' },
        contactEmail: { type: 'string' },
        contactPhone: { type: 'string' },
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
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
  async createOrganization(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: OrganizationProfileDto,
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
    return await this.os.createOrUpdateOrganization(userId, data, logo);
  }

  @Get('')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched all organizations successfully')
  @ApiOperation({
    summary: 'Get all organizations',
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
      message: 'Organizations not found',
    },
  })
  async getAllOrganizations() {
    return await this.os.getAllOrganizations();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched organization profile successfully')
  @ApiOperation({
    summary: 'Get an organization profile',
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
      message: 'Organization profile not found',
    },
  })
  async getOrganizationProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.os.getOrganizationProfile(id);
  }

  @Get('programs/:id')
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Fetched organization programs successfully')
  @ApiOperation({
    summary: 'Get all organization programs',
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
  async getOrganizationTrainingPrograms(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.os.getOrganizationTrainingPrograms(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSTITUTION)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Deleted organization profile successfully')
  @ApiOperation({
    summary: 'Delete an organization profile',
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
      message: 'Organization profile not found',
    },
  })
  async deleteOrganizationProfile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.os.deleteOrganization(id);
  }
}
