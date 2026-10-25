#!/usr/bin/env node
import { CliApplication } from './cli/cli-application.js';
import { HelpCommand, ImportCommand, VersionCommand } from './cli/commands/index.js';

function bootstrap(): Promise<void> {
  const cliApplication = new CliApplication();

  cliApplication.register(
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  );

  return cliApplication.run(process.argv.slice(2));
}

bootstrap();
