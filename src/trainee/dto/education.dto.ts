import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty()
  @IsUUID()
  traineeProfileId: string; // Used by the service for validation

  @ApiProperty()
  @IsString()
  institutionName: string;

  @ApiProperty()
  @IsString()
  qualification: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({ type: 'string', format: 'date' })
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateEducationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  institutionName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
