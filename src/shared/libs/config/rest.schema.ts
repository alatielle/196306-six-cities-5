import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_MAX_RETRIES: number;
  DB_RETRY_TIMEOUT: number;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the DB server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1',
  },
  DB_USER: {
    doc: 'Username to connect to database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  DB_MAX_RETRIES: {
    doc: 'Max amount of DB connection retries',
    format: Number,
    env: 'DB_MAX_RETRIES',
    default: 5,
  },
  DB_RETRY_TIMEOUT: {
    doc: 'Timeout between DB connection retries (milliseconds)',
    format: Number,
    env: 'DB_RETRY_TIMEOUT',
    default: 1000,
  },
});
