

const pg = require('pg');
require('dotenv').config();

// exports.handler = function(event, context) {
// pg.types.setTypeParser(1114, str => str);

    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 5432
    };

 // };

 const client = new pg.Client(dbConfig);
 client.connect(function(err) {
     if (err) throw err;
     console.log("Connected!");
 //     client.end();
 })


 module.exports = {
     client: client
 };
