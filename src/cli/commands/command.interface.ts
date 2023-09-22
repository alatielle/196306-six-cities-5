export interface Command {
  getName(): string;
  run(...parameters: string[]): void;
}
