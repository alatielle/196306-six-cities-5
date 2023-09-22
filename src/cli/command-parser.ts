type CommandName = string;
type CommandArgument = string;
type ParsedCommand = Record<CommandName, CommandArgument[]>;

export class CommandParser {
  static parse(cliArguments: CommandArgument[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
        continue;
      }

      if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
