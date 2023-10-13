import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;
  private readonly logger: Logger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

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
      this.logger.warn('Wrong parameter: count');
      return;
    }

    if (!filepath) {
      this.logger.warn('Wrong parameter: filepath');
      return;
    }

    if (!url) {
      this.logger.warn('Wrong parameter: url');
      return;
    }

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      this.logger.info(`File ${filepath} was created!`);
    } catch (error) {
      this.logger.error('Can\'t generate data', error as Error);
    }
  }
}

export default GenerateCommand;
