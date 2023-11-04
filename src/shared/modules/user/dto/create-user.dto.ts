import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { NAME_LENGTH, PASSWORD_LENGTH } from '../user.constant.js';
import { CREATE_USER_MESSAGES } from './create-user.messages.js';

export class CreateUserDto {
  @IsEmail({}, { message: CREATE_USER_MESSAGES.EMAIL.INVALID_FORMAT })
  public email: string;

  @IsString({ message: CREATE_USER_MESSAGES.NAME.INVALID_FORMAT })
  @Length(NAME_LENGTH.MIN, NAME_LENGTH.MAX, { message: CREATE_USER_MESSAGES.NAME.LENGTH_FIELD })
  public name: string;

  @IsString({ message: CREATE_USER_MESSAGES.PASSWORD.INVALID_FORMAT })
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, { message: CREATE_USER_MESSAGES.PASSWORD.LENGTH_FIELD })
  public password: string;

  @IsEnum(UserType, { message: CREATE_USER_MESSAGES.TYPE.INVALID_FORMAT })
  public type: UserType;
}
