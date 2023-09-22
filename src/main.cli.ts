#!/usr/bin/env node
import chalk from 'chalk';
import { CLIApplication, Command } from './cli/index.js';
import { getFilesByPattern } from './shared/libs/index.js';

const COMMAND = {
  DIR: './src/cli/commands',
  PATTERN: '.command.ts',
};

async function bootstrap() {
  const cliApplication = new CLIApplication();
  const commandFiles = getFilesByPattern(COMMAND.DIR, COMMAND.PATTERN);
  const commands: Command[] = [];
  for (const fileName of commandFiles) {
    const { default: CommandClass } = await import(fileName);
    try {
      commands.push(new CommandClass());
    } catch (error) {
      console.error(chalk.red(`No command found in ${chalk.bold(fileName)}`));
    }
  }
  cliApplication.registerCommands(commands);
  cliApplication.processCommand(process.argv);
}

bootstrap();
