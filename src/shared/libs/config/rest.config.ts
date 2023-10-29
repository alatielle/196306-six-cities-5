import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Config } from './config.interface.js';
import { Logger } from '../logger/index.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Does it exist?');
    }

    configRestSchema.load({});

    try {
      configRestSchema.validate({ allowed: 'strict' });
    } catch (error) {
      this.logger.error('.env file is not valid', error as Error);
      throw new Error('Can\'t validate config');
    }

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and parsed');
  }

  public get<T extends keyof RestSchema>(key: T) {
    return this.config[key];
  }
}
