import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

const COLUMN_SEPARATOR = '\t';
const CHUNK_SIZE = 64 * 1024;

export class TsvFileReader {
  constructor(private readonly filePath: string) {}

  public async *readRows(): AsyncGenerator<string[]> {
    const lines = createInterface({
      input: createReadStream(resolve(this.filePath), { encoding: 'utf-8', highWaterMark: CHUNK_SIZE }),
      crlfDelay: Infinity,
    });

    for await (const line of lines) {
      if (line.trim().length > 0) {
        yield line.split(COLUMN_SEPARATOR);
      }
    }
  }
}
