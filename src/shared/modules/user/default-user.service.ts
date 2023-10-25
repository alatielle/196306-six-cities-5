import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string) {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`👤New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string) {
    const existingUser = await this.findByEmail(dto.email);

    return existingUser ? existingUser : this.create(dto, salt);
  }
}
