import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTraineeProfileDto {
  @ApiProperty({ description: 'A short professional summary.' })
  @IsString()
  headline: string;

  @ApiProperty({ description: 'Detailed biography.' })
  @IsString()
  bio: string;

  @ApiProperty({ description: 'URL to the profile picture.' })
  @IsUrl()
  profilePictureUrl: string;

  @ApiProperty({ description: "URL to the trainee's CV/Resume." })
  @IsUrl()
  cvUrl: string;

  @ApiProperty({ description: 'The current location of the trainee.' })
  @IsString()
  location: string;
}

export class UpdateTraineeProfileDto {
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
