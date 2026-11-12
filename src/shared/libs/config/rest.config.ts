import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/logger.interface.js';
import { Config } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    const parsedEnv = config();

    if (parsedEnv.error) {
      this.logger.warn('.env file was not found, reading only process environment variables');
    }

    // Схема создаётся при импорте модуля, до чтения .env, поэтому переменные окружения нужно перечитать
    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict' });

    this.config = configRestSchema.getProperties();
  }

  public get<K extends keyof RestSchema>(key: K): RestSchema[K] {
    return this.config[key];
  }
}
