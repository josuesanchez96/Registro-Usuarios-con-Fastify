// backend/knexfile.js
require('dotenv').config(); // lee backend/.env cuando corres fuera de Docker

const {
  DB_HOST = 'localhost',
  DB_PORT = '5433',
  DB_USER = 'postgres',
  DB_PASSWORD = '1234',
  DB_NAME = 'david_bd'
} = process.env;

const base = {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = {
  development: base,
  production: base,
  test: {
    ...base,
    connection: { ...base.connection, database: `${DB_NAME}_test` }
  }
};
