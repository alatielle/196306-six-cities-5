import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';
import { DEFAULT_AVATAR_PATH } from '../user.constant.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsOptional()
  @IsString({ message: CreateUserMessages.avatarPath.invalidFormat })
  public avatarPath: string = DEFAULT_AVATAR_PATH;

  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(1, 15, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password: string;

  @IsEnum(UserType, { message: CreateUserMessages.type.invalidFormat })
  public type: UserType;
}
