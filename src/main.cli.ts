#!/usr/bin/env node
import 'reflect-metadata';
import chalk from 'chalk';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { CLIApplication, Command } from './cli/index.js';

const COMMAND = {
  DIR: './src/cli/commands',
  PATTERN: '.command.ts',
};

async function getFilesByPattern(dirPath: string, pattern: string) {
  const dirContent = await readdir(resolve(dirPath));
  const regExp = new RegExp(pattern, 'i');

  return dirContent
    .filter((fileName) => regExp.test(fileName))
    .map((fileName) => resolve(dirPath, fileName));
}

async function bootstrap() {
  const cliApplication = new CLIApplication();
  const commandFiles = await getFilesByPattern(COMMAND.DIR, COMMAND.PATTERN);
  const commands: Command[] = [];
  for (const fileName of commandFiles) {
    const { default: CommandClass } = await import(fileName);
    try {
      commands.push(new CommandClass());
    } catch {
      console.error(chalk.red(`No command found in ${chalk.bold(fileName)}`));
    }
  }
  cliApplication.registerCommands(commands);
  cliApplication.processCommand(process.argv);
}

bootstrap();
