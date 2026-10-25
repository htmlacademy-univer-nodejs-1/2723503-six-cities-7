import axios from 'axios';
import chalk from 'chalk';
import { TsvFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TsvOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { MockServerData } from '../../shared/types/index.js';
import { CliCommand } from './cli-command.interface.js';

const MIN_PHOTOS_IN_MOCKS = 6;

function isMockServerData(value: unknown): value is MockServerData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;
  const lists = [data.titles, data.descriptions, data.previewImages, data.users];

  return lists.every((list) => Array.isArray(list) && list.length > 0)
    && Array.isArray(data.photos) && data.photos.length >= MIN_PHOTOS_IN_MOCKS;
}

function* repeat(count: number, createRow: () => string): Generator<string> {
  for (let i = 0; i < count; i++) {
    yield createRow();
  }
}

export class GenerateCommand implements CliCommand {
  public readonly name = '--generate';

  private async loadMockData(url: string): Promise<MockServerData> {
    const { data } = await axios.get<unknown>(url);

    if (!isMockServerData(data)) {
      throw new Error(`Unexpected mock data format at ${url}`);
    }

    return data;
  }

  public async execute(...params: string[]): Promise<void> {
    const [count, filePath, url] = params;
    const offersCount = Number(count);

    if (!Number.isInteger(offersCount) || offersCount <= 0 || !filePath || !url) {
      console.error(chalk.red('Неверные аргументы. Пример: --generate 100 ./mocks/generated.tsv http://localhost:3123/api'));
      return;
    }

    try {
      const generator = new TsvOfferGenerator(await this.loadMockData(url));
      await new TsvFileWriter(filePath).writeRows(repeat(offersCount, () => generator.generate()));

      console.info(chalk.green(`Сгенерировано предложений: ${offersCount}. Файл: ${filePath}`));
    } catch (error) {
      console.error(chalk.red('Не удалось сгенерировать тестовые данные'));

      if (error instanceof Error) {
        console.error(chalk.gray(error.message || String((error as NodeJS.ErrnoException).code)));
      }
    }
  }
}
