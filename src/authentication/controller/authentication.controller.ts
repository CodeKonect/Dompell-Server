import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  SetMetadata,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationService } from '../service/authentication.service';
import { DataMessageInterceptor } from 'src/interceptors/data-message.interceptor';
import { RegisterDto } from '../dto/register.dto';
import {
  registerBadRequest,
  registerResponse,
  resetBadRequest,
  signinBadRequest,
  signinResponse,
  userExists,
} from 'src/swagger/auth.swagger';
import { loginDto } from '../dto/login.dto';
import { MessageInterceptor } from 'src/interceptors/message.interceptor';
import { ResetPasswordDto } from '../dto/reset.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  public constructor(private as: AuthenticationService) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Account registered successfully')
  @ApiOperation({ summary: 'Registers a new user' })
  @ApiBody({
    description: 'Register request body',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: registerResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: registerBadRequest,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: userExists,
  })
  protected async register(@Body() user: RegisterDto) {
    return await this.as.register(user);
  }

  @Post('verify-account')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Account verified successfully')
  @ApiOperation({ summary: 'Verify a user account' })
  @ApiParam({
    name: 'token',
    description: 'Token to verify user',
    required: true,
  })
  @ApiBody({ description: 'verification code' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'Account verified successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Code is required',
  })
  async verify(@Query('token') token: string, @Body() code: string) {
    return this.as.verifyAccount(code, token);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'Login successful')
  @ApiOperation({ summary: 'Login a user into platform' })
  @ApiBody({
    description: 'Login request body',
    type: loginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: signinResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: signinBadRequest,
  })
  public async signin(@Body() user: loginDto) {
    return await this.as.login(user);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Email sent successfully with opt code')
  @ApiOperation({ summary: 'Send code to user email' })
  @ApiBody({ description: 'Email' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'Email sent successfully with opt code' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Email is required',
  })
  async forgotPassword(@Body() email: string) {
    return this.as.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Password reset successful')
  @ApiOperation({ summary: 'Send code to user email' })
  @ApiBody({ description: 'Reset a user password', type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'Password reset successful' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: resetBadRequest,
  })
  async resetPassword(
    @Query('token') token: string,
    @Body() user: ResetPasswordDto,
  ) {
    return this.as.resetPassword(user, token);
  }

  @Post('resend-code')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'Code sent successfully')
  @ApiOperation({ summary: 'Send a new verification code' })
  @ApiBody({ description: 'user email' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'Code sent successfully to your email' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Email is required',
  })
  async resendCode(@Body() email: string) {
    return this.as.resendCode(email);
  }

  @Post('resend-email')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(MessageInterceptor)
  @SetMetadata('message', 'New email sent successfully')
  @ApiOperation({ summary: 'Send a new verification code' })
  @ApiBody({ description: 'user email' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'New email sent successfully' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Email is required',
  })
  async resendEmail(@Body() email: string) {
    return this.as.resendCode(email);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseInterceptors(DataMessageInterceptor)
  @SetMetadata('message', 'New access token acquired')
  @ApiOperation({ summary: 'Generates a new access token' })
  @ApiBody({ description: 'refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { accessToken: 'new access token' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Refresh token is required',
  })
  async refreshToken(@Body() refreshToken: string) {
    return this.as.refreshToken(refreshToken);
  }
}
