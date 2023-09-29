import { Config } from './config.interface.js';

export class RestConfig implements Config {
  constructor(private readonly config: NodeJS.ProcessEnv) {}

  public get(key: string) {
    return this.config[key];
  }
}
