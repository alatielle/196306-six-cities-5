import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { retry } from '../../helpers/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string, options: { maxRetries: number; retryTimeout: number }) {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('🍃Trying to connect to MongoDB…');

    await retry({
      attempts: options.maxRetries,
      timeout: options.retryTimeout,
      operation: async () => {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
      },
      onSuccess: () => {
        this.logger.info('🍃Database connection established.');
      },
      onError: (attempt: number, error: unknown) => {
        const isLastAttempt = attempt === options.maxRetries;

        if (isLastAttempt) {
          throw new Error(`Unable to establish database connection after ${options.maxRetries} attempts`);
        }

        this.logger.error(`🍃Failed to connect to the database. Attempt ${attempt}`, error as Error);
      },
    });
  }

  public async disconnect() {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;

    this.logger.info('🍃Database connection closed.');
  }
}
