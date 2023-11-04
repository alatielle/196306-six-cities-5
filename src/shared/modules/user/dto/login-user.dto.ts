import { IsEmail, IsString } from 'class-validator';
import { LOGIN_USER_MESSAGES } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: LOGIN_USER_MESSAGES.EMAIL.INVALID_FORMAT })
  public email: string;

  @IsString({ message: LOGIN_USER_MESSAGES.PASSWORD.INVALID_FORMAT })
  public password: string;
}
