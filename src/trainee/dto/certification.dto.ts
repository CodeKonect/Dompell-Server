import {
  IsString,
  IsOptional,
  IsDateString,
  IsUrl,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCertificationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  issuingOrganization: string;

  @ApiProperty()
  @IsUrl()
  credentialUrl: string;

  @ApiProperty({ type: 'string', format: 'date' })
  @Type(() => Date)
  @IsDate()
  issueDate: Date;
}

export class UpdateCertificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  issuingOrganization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  issueDate?: Date;
}
