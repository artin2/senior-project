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

client.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err) // your callback here
  process.exit(-1)
})

module.exports = {
  client: client
};
