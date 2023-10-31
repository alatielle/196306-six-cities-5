import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

import { Component } from '../../../types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { Logger } from '../../logger/index.js';
import { ApplicationError } from '../types/index.js';
import { ExceptionFilter } from './exception-filter.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FileUploadExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Registering FileUploadExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof MulterError)) {
      return next(error);
    }

    this.logger.error(`${error.code} - ${error.message} - ${error.field}`, error);

    const statusCode = error.code === 'LIMIT_UNEXPECTED_FILE' ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;

    res
      .status(statusCode)
      .json(createErrorObject(ApplicationError.ServiceError, 'File upload error', [{
        property: error.field ?? '',
        messages: [error.message]
      }]));
  }
}
