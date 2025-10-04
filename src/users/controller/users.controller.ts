import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
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
import { UsersService } from '../service/users.service';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/guards/role/role.decorator';
import { RolesGuard } from 'src/guards/role/roles.guard';
import { DataMessageInterceptor } from 'src/interceptors/data-message.interceptor';
import { MessageInterceptor } from 'src/interceptors/message.interceptor';
import {
  accessDeniedResponse,
  getAllResponse,
  profileResponse,
  unauthorizedResponse,
  updateUserResponse,
  UsersQueryDto,
} from 'src/swagger/users.swagger';
import { UserUpdateDto } from '../dto/update_user.dto';

@ApiTags('Users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('all')
  @Roles(Role.ADMIN, Role.ORGANIZATION)
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Users fetched successfully')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: getAllResponse,
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
  async getAllUsers(@Query() query: UsersQueryDto) {
    return await this.userService.getAllUsers(query);
  }

  @Get(':id')
  @HttpCode(200)
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'User fetched successfully')
  @ApiOperation({ summary: 'Get a user profile' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: profileResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    example: { message: 'User ID not valid' },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findUserById(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'User updated successfully')
  @ApiOperation({ summary: 'Updates a user' })
  @ApiBody({
    description: 'user update request body',
    type: UserUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: updateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: accessDeniedResponse,
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UserUpdateDto,
  ) {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.ORGANIZATION)
  @HttpCode(200)
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'User deleted successfully')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    example: { message: 'User ID not valid' },
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
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
