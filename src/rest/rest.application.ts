import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter, ParseTokenMiddleware } from '../shared/libs/rest/index.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';

@injectable()
export class RestApplication {
  private server: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.CityController) private readonly cityController: Controller,
    @inject(Component.ExceptionFilter) private readonly baseExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
    @inject(Component.FileUploadExceptionFilter) private readonly fileUploadExceptionFilter: ExceptionFilter
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(
      mongoUri,
      this.config.get('DB_MAX_RETRIES'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
    this.server.use('/cities', this.cityController.router);
  }

  private async initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get('JWT_SECRET')
    );

    this.server.use(express.json());
    this.server.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY')));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.fileUploadExceptionFilter.catch.bind(this.fileUploadExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Initializing database…');
    await this.initDb();
    this.logger.info('Database initialization complete.');

    this.logger.info('Initializing app-level middleware…');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization complete.');

    this.logger.info('Initializing controllers…');
    await this.initControllers();
    this.logger.info('Controller initialization complete.');

    this.logger.info('Initializing exception filters…');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization complete.');

    this.logger.info('Initializing server…');
    await this.initServer();
    this.logger.info(`🚀 Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
