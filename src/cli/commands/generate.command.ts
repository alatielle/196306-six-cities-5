import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { logError, logInfo } from '../../shared/helpers/console.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async run(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (!Number.isInteger(offerCount)) {
      logError('Wrong parameter: count');
      return;
    }

    if (!filepath) {
      logError('Wrong parameter: filepath');
      return;
    }

    if (!url) {
      logError('Wring parameter: url');
      return;
    }

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      logInfo(`File ${filepath} was created!`);
    } catch (error) {
      logError('Can\'t generate data');
      logError(getErrorMessage(error));
    }
  }
}

export default GenerateCommand;
