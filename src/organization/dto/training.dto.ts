import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainingProgramDto {
  @ApiProperty({ example: 'AI and Machine Learning for Beginners' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A 6-week introduction to machine learning concepts.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['Understand ML basics', 'Train basic AI models'] })
  @IsArray()
  keyLearningOutcomes: string[];

  @ApiProperty({ example: '6 weeks' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: ['AWS Certified ML Practitioner'] })
  @IsArray()
  @IsOptional()
  associatedCertifications?: string[];

  @ApiProperty({ example: '2025-11-01T09:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-15T17:00:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: 'Applicants should have basic programming knowledge.',
  })
  @IsString()
  @IsNotEmpty()
  eligibilityCriteria: string;

  @ApiProperty({
    example: 'Apply via the portal and upload your transcripts and CV.',
  })
  @IsString()
  @IsNotEmpty()
  applicationProcess: string;

  @ApiProperty({ example: 'https://example.com/brochure.pdf' })
  @IsOptional()
  @IsString()
  brochureUrl?: string;
}
