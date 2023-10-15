import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { PASSWORD_FORMAT } from '../../../config/constants/validate.input';
export class RegisterUserInput {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegExp(PASSWORD_FORMAT.PASSWORD_REGEX), {
    message: PASSWORD_FORMAT.MESSAGE,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
