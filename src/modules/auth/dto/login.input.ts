import { IsString, IsNotEmpty } from 'class-validator';
export class LoginUserInput {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
