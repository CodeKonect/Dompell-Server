import {
  Controller,
  HttpCode,
  Post,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service, SafeFile } from '../service/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageInterceptor } from 'src/interceptors/message.interceptor';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3: S3Service) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'), MessageInterceptor)
  @SetMetadata('message', 'File upload successful')
  @ApiOperation({ summary: 'Uploads a file to AWS S3 bucket' })
  @ApiBody({ description: 'file' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: { message: 'File upload successful' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'File must have an extension.',
  })
  async uploadFile(@UploadedFile() file: SafeFile) {
    return await this.s3.uploadFile(file);
  }
}
