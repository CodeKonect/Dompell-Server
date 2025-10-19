import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsUrl } from 'class-validator';

export class EmployerDto {
  @ApiProperty({ example: 'TechNova Solutions' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Software Development' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    example: 'We provide AI-driven enterprise software solutions.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://technova.io' })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid website URL format' })
  website?: string;

  @ApiProperty({ example: 'https://cdn.technova.io/logo.png' })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL format' })
  logoUrl?: string;

  @ApiProperty({ example: 'Accra, Ghana' })
  @IsOptional()
  @IsString()
  location?: string;
}
