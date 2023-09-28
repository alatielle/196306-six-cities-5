import chalk from 'chalk';

export function logError(message: string) {
  console.error(chalk.red(message));
}

export function logInfo(message: string) {
  console.info(chalk.bold(message));
}
