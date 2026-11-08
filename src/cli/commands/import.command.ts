import chalk from 'chalk';
import { parseOffer } from '../../shared/helpers/offer-parser.js';
import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { TsvFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { CommentModel } from '../../shared/modules/comment/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/index.js';
import { CliCommand } from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  public readonly name = '--import';

  private readonly logger: Logger;
  private readonly databaseClient: DatabaseClient;
  private readonly userService: UserService;
  private readonly offerService: OfferService;

  constructor() {
    this.logger = new PinoLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(UserModel);
    this.offerService = new DefaultOfferService(OfferModel, CommentModel);
  }

  private async saveOffer(offer: Offer, salt: string): Promise<void> {
    const { author, ...offerData } = offer;
    const user = await this.userService.findByEmail(author.email)
      ?? await this.userService.create(author, salt);

    await this.offerService.create({ ...offerData, authorId: user.id });
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath, dbUri, salt] = params;

    if (!filePath || !dbUri || !salt) {
      console.error(chalk.red('Неверные аргументы. Пример: --import ./mocks/offers.tsv mongodb://<user>:<password>@<host>:<port>/<db-name>?authSource=admin <salt>'));
      return;
    }

    const reader = new TsvFileReader(filePath.trim());
    let importedCount = 0;

    try {
      await this.databaseClient.connect(dbUri);

      for await (const columns of reader.readRows()) {
        let offer: Offer;

        try {
          offer = parseOffer(columns);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          throw new Error(`Запись ${importedCount + 1}: ${reason}`);
        }

        await this.saveOffer(offer, salt);
        importedCount++;
      }

      console.info(chalk.green(`Импортировано предложений: ${importedCount}`));
    } catch (error) {
      console.error(chalk.red(`Не удалось импортировать данные из файла «${filePath}»`));

      if (error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
