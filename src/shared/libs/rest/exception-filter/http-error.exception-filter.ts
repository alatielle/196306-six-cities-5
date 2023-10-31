import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { Component } from '../../../types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { Logger } from '../../logger/index.js';
import { HttpError } from '../errors/index.js';
import { ApplicationError } from '../types/index.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Registering HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
