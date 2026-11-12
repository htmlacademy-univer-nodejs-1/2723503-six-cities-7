import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { getMongoURI } from '../shared/helpers/database.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Controller, ExceptionFilter, ParseTokenMiddleware } from '../shared/libs/rest/index.js';
import { Component } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.FavoriteController) private readonly favoriteController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
  ) {}

  private async initDb(): Promise<void> {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
  }

  private async initMiddleware(): Promise<void> {
    this.server.use(express.json());
    this.server.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));

    const parseTokenMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(parseTokenMiddleware.execute.bind(parseTokenMiddleware));
  }

  private async initControllers(): Promise<void> {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/offers', this.commentController.router);
    this.server.use('/favorites', this.favoriteController.router);
    this.server.use('/users', this.userController.router);
  }

  private async initExceptionFilters(): Promise<void> {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private async initServer(): Promise<void> {
    const port = this.config.get('PORT');

    await new Promise<void>((resolve) => {
      this.server.listen(port, resolve);
    });

    this.logger.info(`Server started on http://localhost:${port}`);
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialized');

    await this.initDb();
    await this.initMiddleware();
    await this.initControllers();
    await this.initExceptionFilters();
    await this.initServer();
  }
}
