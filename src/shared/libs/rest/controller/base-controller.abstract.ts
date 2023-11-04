import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';

import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../types/index.js';
import { PathTransformer } from '../transform/index.js';
import { Controller } from './controller.interface.js';
import { DEFAULT_CONTENT_TYPE } from './controller.constant.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly expressRouter: Router = Router();
  @inject(Component.PathTransformer) private readonly pathTransformer: PathTransformer;

  constructor(protected readonly logger: Logger) {}

  get router() {
    return this.expressRouter;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map((item) =>
      asyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : wrapperAsyncHandler;
    this.expressRouter[route.method](route.path, allHandlers);
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res.type(DEFAULT_CONTENT_TYPE).status(statusCode).json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
