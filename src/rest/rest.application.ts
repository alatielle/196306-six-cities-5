import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.ExceptionFilter) private readonly baseExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri, {
      maxRetries: this.config.get('DB_MAX_RETRIES'),
      retryTimeout: this.config.get('DB_RETRY_TIMEOUT'),
    });
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/users', this.userController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initExceptionFilters() {
    this.server.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Initializing database…');
    await this._initDb();
    this.logger.info('Database initialization complete.');

    this.logger.info('Initializing app-level middleware…');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization complete.');

    this.logger.info('Initializing controllers…');
    await this._initControllers();
    this.logger.info('Controller initialization complete.');

    this.logger.info('Initializing exception filters…');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization complete.');

    this.logger.info('Initializing server…');
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}.`);
  }
}
