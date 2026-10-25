import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

function* toLines(rows: Iterable<string>): Generator<string> {
  for (const row of rows) {
    yield `${row}\n`;
  }
}

export class TsvFileWriter {
  constructor(private readonly filePath: string) {}

  public async writeRows(rows: Iterable<string>): Promise<void> {
    await pipeline(
      Readable.from(toLines(rows)),
      createWriteStream(resolve(this.filePath), { encoding: 'utf-8' }),
    );
  }
}
