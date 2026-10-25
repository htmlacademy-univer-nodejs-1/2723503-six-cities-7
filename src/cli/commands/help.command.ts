import chalk from 'chalk';
import { CliCommand } from './cli-command.interface.js';

const COMMANDS_DESCRIPTION: ReadonlyArray<[usage: string, description: string]> = [
  ['--version', 'выводит номер версии приложения'],
  ['--help', 'печатает этот текст'],
  ['--import <path>', 'импортирует данные из TSV-файла'],
  ['--generate <n> <path> <url>', 'генерирует произвольное количество тестовых данных'],
];

export class HelpCommand implements CliCommand {
  public readonly name = '--help';

  public execute(): void {
    const usageWidth = Math.max(...COMMANDS_DESCRIPTION.map(([usage]) => usage.length));
    const commandLines = COMMANDS_DESCRIPTION
      .map(([usage, description]) => `  ${chalk.cyan(usage.padEnd(usageWidth))}  ${chalk.gray('#')} ${description}`)
      .join('\n');

    console.info(`
${chalk.bold.magenta('Шесть городов')} ${chalk.gray('—')} программа для подготовки данных для REST API сервера.

${chalk.yellow('Пример:')}
  ${chalk.green('cli.js --<command> [--arguments]')}

${chalk.yellow('Команды:')}
${commandLines}
`);
  }
}
