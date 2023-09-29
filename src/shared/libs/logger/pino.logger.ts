import { resolve } from 'node:path';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { getCurrentDirectoryPath } from '../../helpers/index.js';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const fileTransport = transport({
      target: 'pino/file',
      options: { destination },
    });

    this.logger = pino({}, fileTransport);
  }

  public debug(message: string, ...args: unknown[]) {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]) {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]) {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]) {
    this.logger.warn(message, ...args);
  }
}
