import { Container } from 'inversify';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestConfig } from '../shared/libs/config/rest.config.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';
import { offerContainerModule } from '../shared/modules/offer/index.js';
import { userContainerModule } from '../shared/modules/user/index.js';
import { Component } from '../shared/types/index.js';
import { RestApplication } from './rest.application.js';

export function createRestContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  container.load(userContainerModule, offerContainerModule);

  return container;
}
