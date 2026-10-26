import chalk from 'chalk';
import { CliCommand } from './commands/index.js';

const COMMAND_PREFIX = '--';

type ParsedCommand = {
  name: string;
  params: string[];
};

export class CliApplication {
  private readonly commands = new Map<string, CliCommand>();

  constructor(private readonly defaultCommandName = '--help') {}

  public register(...commands: CliCommand[]): this {
    commands.forEach((command) => {
      if (this.commands.has(command.name)) {
        throw new Error(`Command ${command.name} is already registered`);
      }

      this.commands.set(command.name, command);
    });

    return this;
  }

  private parse(argv: string[]): ParsedCommand | null {
    const [name, ...rest] = argv;

    if (!name?.startsWith(COMMAND_PREFIX)) {
      return null;
    }

    const nextCommandIndex = rest.findIndex((arg) => arg.startsWith(COMMAND_PREFIX));
    const params = nextCommandIndex === -1 ? rest : rest.slice(0, nextCommandIndex);

    return { name, params };
  }

  private getDefaultCommand(): CliCommand {
    const command = this.commands.get(this.defaultCommandName);

    if (!command) {
      throw new Error(`Default command ${this.defaultCommandName} is not registered`);
    }

    return command;
  }

  public async run(argv: string[]): Promise<void> {
    const parsed = this.parse(argv);

    if (!parsed) {
      if (argv.length > 0) {
        console.warn(chalk.yellow(`Не удалось распознать аргументы: ${argv.join(' ')}`));
      }

      return this.getDefaultCommand().execute();
    }

    const command = this.commands.get(parsed.name);

    if (!command) {
      console.warn(chalk.yellow(`Неизвестная команда: ${parsed.name}`));
      return this.getDefaultCommand().execute();
    }

    await command.execute(...parsed.params);
  }
}
