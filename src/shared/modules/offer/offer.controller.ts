import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');
  }
}
