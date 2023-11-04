import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';

type PackageJSONConfig = {
  version: string;
};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  private readonly logger: Logger;

  constructor(private readonly filePath: string = './package.json') {
    this.logger = new ConsoleLogger();
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public run(): void {
    try {
      const version = this.readVersion();
      this.logger.info(chalk.green(version));
    } catch (error) {
      this.logger.error(
        `Failed to read version from ${chalk.bold(this.filePath)}`,
        error as Error,
      );
    }
  }
}

export default VersionCommand;
