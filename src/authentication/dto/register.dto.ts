import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validations } from '../../utils/constants';
import { Match } from '../../decorators/passwords.decorator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'Alex Mahone',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, {
    message: validations.name,
  })
  name: string;

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
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: validations.password,
    },
  )
  password: string;

  @ApiProperty({
    example: 'strongPass123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: 'Confirm password must match password',
  })
  confirmPassword: string;

  @ApiProperty({
    example: Role.TRAINEE,
    enum: Role,
    required: true,
    description:
      'The user role, must be one of: TRAINEE, ORGANIZATION, MENTOR, ADMIN',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
