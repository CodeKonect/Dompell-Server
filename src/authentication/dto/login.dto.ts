import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @ApiProperty({
    example: 'alex@test.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPass123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
