import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddSkillDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateSkillsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
