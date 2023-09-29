import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import {
  logError,
  logInfo,
  getErrorMessage,
} from '../../shared/helpers/index.js';

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
  constructor(private readonly filePath: string = './package.json') {}

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

  public run(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      logInfo(chalk.green(version));
    } catch (error) {
      logError(`Failed to read version from ${chalk.bold(this.filePath)}`);
      logError(getErrorMessage(error));
    }
  }
}

export default VersionCommand;
