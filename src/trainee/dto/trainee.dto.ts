import { IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTraineeProfileDto {
  @ApiProperty({ description: 'The user ID this profile belongs to.' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The full name of the trainee.' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'A short professional summary.' })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional({ description: 'Detailed biography.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'URL to the profile picture.' })
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'URL to the trainee’s CV/Resume.' })
  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @ApiPropertyOptional({ description: 'The current location of the trainee.' })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateTraineeProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}
