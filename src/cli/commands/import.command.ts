import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { logError, logInfo } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer, '\n');
  }

  private onCompleteImport(count: number) {
    logInfo(`${count} rows imported.`);
  }

  public async run(...parameters: string[]): Promise<void> {
    if (!parameters.length) {
      logError('No filename to import from');
      return;
    }

    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      logError(`Can't import data from file: ${chalk.bold(filename)}`);
      logError(getErrorMessage(error));
    }
  }
}

export default ImportCommand;
