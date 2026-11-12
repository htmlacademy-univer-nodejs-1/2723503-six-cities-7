import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SALT: string;
  UPLOAD_DIRECTORY: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  DB_PORT: {
    doc: 'Port of the database server',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  SALT: {
    doc: 'Salt for password hashing',
    format: String,
    env: 'SALT',
    default: null,
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for files uploaded by clients',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
});
