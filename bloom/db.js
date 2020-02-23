

const pg = require('pg');

// exports.handler = function(event, context) {
// pg.types.setTypeParser(1114, str => str);

    const dbConfig = {
      host: 'bloom-db.cvtddlfbioiq.us-east-1.rds.amazonaws.com',
      user: 'roula',
      password: 'cpsc490!',
      database: 'bloom_db',
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
