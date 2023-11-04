import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public run(): void {
    console.info(`Программа для подготовки данных для REST API сервера.

${chalk.bold('ПРИМЕР')}
    ${chalk.bold('npm run cli')} -- --${chalk.underline('command')} [...${chalk.underline('arguments')}]

${chalk.bold('КОМАНДЫ')}
    ${chalk.bold('--version')}
        Выводит информацию о версии приложения из файла package.json
    ${chalk.bold('--help')}
        Выводит информацию о списке поддерживаемых приложением команд
    ${chalk.bold('--import')} ${chalk.underline('path')} ${chalk.underline('db_login')} ${chalk.underline('db_pass')} ${chalk.underline('db_host')} ${chalk.underline('db_name')} ${chalk.underline('salt')}
        Импортирует данные о предложениях об аренде из tsv-файла в базу данных
    ${chalk.bold('--generate')} ${chalk.underline('n')} ${chalk.underline('path')} ${chalk.underline('url')}
        Генерирует n предложений об аренде в файл формата tsv
`);
  }
}

export default HelpCommand;
