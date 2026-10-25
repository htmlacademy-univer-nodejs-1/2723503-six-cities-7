export interface CliCommand {
  readonly name: string;
  execute(...params: string[]): void | Promise<void>;
}
