const pg = require('pg');
pg.types.setTypeParser(1114, str => str);
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
};

const client = new pg.Pool(dbConfig);

module.exports = {
  client: client
};
