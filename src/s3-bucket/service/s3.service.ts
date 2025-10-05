import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface SafeFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: SafeFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const bucketName = this.config.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    const fileExtension = path.extname(file.originalname);
    if (!fileExtension) {
      throw new BadRequestException('File must have an extension.');
    }
    const key = `${uuidv4()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      return `https://${bucketName}.s3.${this.config.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    } catch (error: unknown) {
      this.handleError(error, 'uploading');
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!key || typeof key !== 'string') {
      throw new BadRequestException('Invalid S3 key provided.');
    }

    const bucketName = this.config.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await this.s3.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error: unknown) {
      this.handleError(error, 'deleting');
    }
  }

  private handleError(error: unknown, action: string): never {
    if (error instanceof Error) {
      this.logger.error(
        `Error ${action} file in S3: ${error.message}`,
        error.stack,
      );
    } else {
      this.logger.error(
        `Unknown error occurred while ${action} file`,
        JSON.stringify(error),
      );
    }
    throw new Error(`Failed to ${action} file in S3.`);
  }
}
