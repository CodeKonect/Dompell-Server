import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationProfileDto {
  @ApiProperty({
    example: 'Mest Africa',
    description: 'Name of the institution',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  institutionName: string;

  @ApiProperty({
    example: 'University',
    description:
      'Type of the institution (e.g., University, Vocational School)',
    required: false,
  })
  @IsOptional()
  @IsString()
  institutionType?: string;

  @ApiProperty({
    example:
      'TechBridge University focuses on equipping students with practical digital and innovation skills.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example:
      'Our mission is to bridge the digital gap through hands-on training and innovation programs.',
    required: false,
  })
  @IsOptional()
  @IsString()
  missionVision?: string;

  @ApiProperty({
    example: 'https://example-bucket.s3.amazonaws.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'logoUrl must be a valid URL' })
  logoUrl?: string;

  @ApiProperty({
    example: 'https://techbridgeuniversity.edu',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'websiteUrl must be a valid URL' })
  websiteUrl?: string;

  @ApiProperty({
    example: 'Accredited by the Ministry of Education since 2015.',
    required: false,
  })
  @IsOptional()
  @IsString()
  accreditationDetails?: string;

  @ApiProperty({
    example: 'info@techbridgeuniversity.edu',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid contact email' })
  contactEmail?: string;

  @ApiProperty({
    example: '+233245678901',
    required: false,
    description: 'Primary contact phone number of the institution',
  })
  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'contactPhone must be a valid phone number',
  })
  contactPhone?: string;
}
