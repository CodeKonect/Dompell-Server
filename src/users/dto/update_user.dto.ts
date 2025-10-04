import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { validations } from '../../utils/constants';

export class UserUpdateDto {
  @ApiProperty({ example: 'Alex Mahone' })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, {
    message: validations.name,
  })
  name: string;

  @ApiProperty({ example: 'alex@test.com' })
  @IsString()
  @IsEmail()
  email: string;
}
