import chalk from 'chalk';
import { parseOffer } from '../../shared/helpers/offer-parser.js';
import { TsvFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Offer } from '../../shared/types/index.js';
import { CliCommand } from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  private printOffer(offer: Offer, position: number): void {
    const premiumMark = offer.isPremium ? ` ${chalk.bgYellow.black(' PREMIUM ')}` : '';

    console.info(
      `${chalk.gray(`${position}.`)} ${chalk.bold(offer.title)}${premiumMark} · ${chalk.cyan(offer.city)} · ${offer.housingType} · ${chalk.green(`€${offer.price}`)} · ★ ${offer.rating} · ${chalk.gray(offer.author.email)}`
    );
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath] = params;

    if (!filePath) {
      console.error(chalk.red('Не указан путь к файлу. Пример: --import ./mocks/offers.tsv'));
      return;
    }

    const reader = new TsvFileReader(filePath.trim());
    let importedCount = 0;

    try {
      for await (const columns of reader.readRows()) {
        let offer: Offer;

        try {
          offer = parseOffer(columns);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          throw new Error(`Запись ${importedCount + 1}: ${reason}`);
        }

        importedCount++;
        this.printOffer(offer, importedCount);
      }

      console.info(chalk.green(`\nИмпортировано предложений: ${importedCount}`));
    } catch (error) {
      console.error(chalk.red(`Не удалось импортировать данные из файла «${filePath}»`));

      if (error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    }
  }
}
