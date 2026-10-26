import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROW_SEPARATOR = /\r?\n/;
const COLUMN_SEPARATOR = '\t';

export class TsvFileReader {
  private content = '';

  constructor(private readonly filePath: string) {}

  public read(): void {
    this.content = readFileSync(resolve(this.filePath), { encoding: 'utf-8' });
  }

  public getRows(): string[][] {
    return this.content
      .split(ROW_SEPARATOR)
      .filter((row) => row.trim().length > 0)
      .map((row) => row.split(COLUMN_SEPARATOR));
  }
}
