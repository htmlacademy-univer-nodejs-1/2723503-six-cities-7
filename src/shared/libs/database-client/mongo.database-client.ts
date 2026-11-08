import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/logger.interface.js';
import { DatabaseClient } from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private isConnected = false;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to MongoDB…');

    await mongoose.connect(uri);
    this.isConnected = true;

    this.logger.info('Database connection established');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;

    this.logger.info('Database connection closed');
  }
}
