import chalk from 'chalk';
import { parseOffer } from '../../shared/helpers/offer-parser.js';
import { TsvFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Offer } from '../../shared/types/index.js';
import { CliCommand } from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  private printOffer(offer: Offer, index: number): void {
    const premiumMark = offer.isPremium ? ` ${chalk.bgYellow.black(' PREMIUM ')}` : '';

    console.info(`${chalk.gray(`${index + 1}.`)} ${chalk.bold(offer.title)}${premiumMark}`);
    console.info(`   ${chalk.cyan(offer.city)} · ${offer.housingType} · ${chalk.green(`€${offer.price}`)} · ★ ${offer.rating}`);
    console.info(`   ${chalk.gray('автор:')} ${offer.author.name} <${offer.author.email}> (${offer.author.type})`);
  }

  public execute(...params: string[]): void {
    const [filePath] = params;

    if (!filePath) {
      console.error(chalk.red('Не указан путь к файлу. Пример: --import ./mocks/offers.tsv'));
      return;
    }

    try {
      const reader = new TsvFileReader(filePath.trim());
      reader.read();

      const offers = reader.getRows().map((columns, rowIndex) => {
        try {
          return parseOffer(columns);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          throw new Error(`Строка ${rowIndex + 1}: ${reason}`);
        }
      });

      console.info(chalk.green(`Импортировано предложений: ${offers.length}\n`));
      offers.forEach((offer, index) => this.printOffer(offer, index));
    } catch (error) {
      console.error(chalk.red(`Не удалось импортировать данные из файла «${filePath}»`));

      if (error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    }
  }
}
