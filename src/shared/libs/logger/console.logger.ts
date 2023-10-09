import chalk from 'chalk';
import { Logger } from './logger.interface.js';
import { getErrorMessage } from '../../helpers/index.js';

export class ConsoleLogger implements Logger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(chalk.red(message, ...args));
    console.error(chalk.red(`Error message: ${getErrorMessage(error)}`));
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(chalk.bold(message, ...args));
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(chalk.yellow(message, ...args));
  }
}
