import { DataSource, DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import * as path from 'path';

const entitiesPath = path.join(__dirname, '../entities/**/*.entity{.ts,.js}');
const migrationsPath = path.join(__dirname, '../migration/*{.ts,.js}');
const subscribersPath = path.join(
  __dirname,
  '../database/subscriber/**/*{.ts,.js}',
);

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.RDS_HOST,
  port: +process.env.RDS_PORT,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  entities: [entitiesPath],
  synchronize: false,
  migrations: [migrationsPath],
  subscribers: [subscribersPath],
};

export const dataSource = new DataSource(dataSourceOptions);
