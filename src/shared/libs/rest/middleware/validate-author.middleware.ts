import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IsDocumentAuthor } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { Middleware } from './middleware.interface.js';

export class ValidateAuthorMiddleware implements Middleware {
  constructor(
    private readonly service: IsDocumentAuthor,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const documentId = params[this.paramName];

    if (!(await this.service.isAuthor(tokenPayload.id, documentId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `No rights for ${this.entityName} with id ${documentId}.`,
        'ValidateAuthorMiddleware',
      );
    }

    next();
  }
}
