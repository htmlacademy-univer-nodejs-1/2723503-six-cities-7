import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { CliCommand } from './cli-command.interface.js';

type PackageJson = {
  version: string;
};

function isPackageJson(value: unknown): value is PackageJson {
  return typeof value === 'object'
    && value !== null
    && 'version' in value
    && typeof (value as Record<string, unknown>).version === 'string';
}

export class VersionCommand implements CliCommand {
  public readonly name = '--version';

  constructor(private readonly packageJsonPath = './package.json') {}

  private readVersion(): string {
    const content: unknown = JSON.parse(readFileSync(resolve(this.packageJsonPath), 'utf-8'));

    if (!isPackageJson(content)) {
      throw new Error(`Field "version" is missing in ${this.packageJsonPath}`);
    }

    return content.version;
  }

  public execute(): void {
    try {
      console.info(chalk.green(this.readVersion()));
    } catch (error) {
      console.error(chalk.red(`Не удалось прочитать версию из ${this.packageJsonPath}`));

      if (error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    }
  }
}
