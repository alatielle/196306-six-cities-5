import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public run(..._parameters: string[]): void {
    console.info(`Программа для подготовки данных для REST API сервера.

${chalk.bold('ПРИМЕР')}
    ${chalk.bold('cli.js')} --${chalk.underline('command')} [...${chalk.underline('arguments')}]

${chalk.bold('КОМАНДЫ')}
    ${chalk.bold('--version')}
        Выводит номер версии
    ${chalk.bold('--help')}
        Печатает этот текст
    ${chalk.bold('--import')} ${chalk.underline('path')} ${chalk.underline('db_login')} ${chalk.underline('db_pass')} ${chalk.underline('db_host')} ${chalk.underline('db_name')} ${chalk.underline('salt')}
        Импортирует данные из TSV
    ${chalk.bold('--generate')} ${chalk.underline('n')} ${chalk.underline('path')} ${chalk.underline('url')}
        Генерирует произвольное количество тестовых данных
`);
  }
}

export default HelpCommand;
