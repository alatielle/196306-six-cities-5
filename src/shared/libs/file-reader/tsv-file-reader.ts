import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader<Data> implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string,
    private readonly transformer: (data: string[]) => Data,
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Data[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map((data) => this.transformer(data));
  }
}
