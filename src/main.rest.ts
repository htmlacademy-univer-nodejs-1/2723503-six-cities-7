import 'reflect-metadata';
import { createRestContainer } from './rest/rest.container.js';
import { RestApplication } from './rest/rest.application.js';
import { Logger } from './shared/libs/logger/logger.interface.js';
import { Component } from './shared/types/index.js';

async function bootstrap(): Promise<void> {
  const container = createRestContainer();

  try {
    const application = container.get<RestApplication>(Component.RestApplication);
    await application.init();
  } catch (error) {
    const logger = container.get<Logger>(Component.Logger);
    logger.error('Application failed to start', error instanceof Error ? error : undefined);
    process.exitCode = 1;
  }
}

bootstrap();
