const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
 
  // Optional depending on the providers
  // httpAdapter: 'https', // Default
  apiKey: process.env.GOOGLE_API_KEY
  // formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);


async function getStore(req, res, next) {
  //verify user cookie -- or header??
  try{
    // not sure if we are doing this correctly...
    await auth.verifyToken(req, res, next);
    let storeId = req.params.id
    let query = 'SELECT * FROM stores WHERE id=' + storeId

    db.client.connect(function(err) {
      db.client.query(query,
        async (err, result) => {
          if (result) {
            if(result.rows.length == 0){
              let error = { error: "No Results" }
              helper.queryError(res, error);
            }
            else{
              helper.querySuccess(res, result.rows[0]);
            }
          }

          if (err) {
            helper.queryError(res, err);
          }
      });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch(err){
    helper.authError(res, err);
  }
};

async function getStores(req, res, next) {
  //verify user cookie -- or header??
  try{
    // not sure if we are doing this correctly...
    await auth.verifyToken(req, res, next);
    let query = 'SELECT * FROM stores'

    db.client.connect(function(err) {
      db.client.query(query,
        async (err, result) => {
          if (result) {
            if(result.rows.length == 0){
              let error = { error: "No Results" }
              helper.queryError(res, error);
            }
            else{
              helper.querySuccess(res, result.rows);
            }
          }

          if (err) {
            helper.queryError(res, err);
          }
      });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch(err){
    helper.authError(res, err);
  }
};

async function editStore(req, res, next) {
  //verify user cookie -- or header??
  try{
    // not sure if we are doing this correctly...
    await auth.verifyToken(req, res, next);
    let timestamp = helper.getFormattedDate();
    // should fix this later so it only does it when the address has changed
    let geocodeResult = await geocoder.geocode({address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode})
    let lat = geocodeResult[0].latitude
    let lng = geocodeResult[0].longitude
    let query = 'UPDATE stores SET name=$1, street=$2, city=$3, state=$4, zipcode=$5, created_at=$6, category=$7, phone=$8, service=$9, owners=$10, description=$11, pictures=$12, lat=$13, lng=$14 WHERE id=$15'
    let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, timestamp, req.body.category, req.body.phone, req.body.service, req.body.owners, req.body.description, req.body.pictures, lat, lng, req.body.id]

    db.client.connect(function(err) {
      db.client.query(query, values,
        async (err, result) => {
          if (result) {
            helper.querySuccess(res, result.rows[0]);
          }

          if (err) {
            helper.queryError(res, err);
          }
      });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch(err){
    helper.authError(res, err);
  }
};

async function addStore(req, res, next) {

        //verify user cookie -- or header??
        try{
          // not sure if we are doing this correctly...
          await auth.verifyToken(req, res, next);
          let geocodeResult = await geocoder.geocode({address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode})
          let timestamp = helper.getFormattedDate();
          console.log(geocodeResult)
          let lat = geocodeResult[0].latitude
          let lng = geocodeResult[0].longitude
          // need to update this to include description and phone number, and when we add a store, service is not created, so take that out
          // for now going to insert service and owners manually until someone updates db
          let query = 'INSERT INTO stores(name, street, city, state, zipcode, created_at, category, phone, description, pictures, lat, lng, service, owners) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;'
          let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, timestamp, req.body.category, req.body.phone, req.body.description, req.body.pictures, lat, lng, [0], [0]]

          db.client.connect(function(err) {
            db.client.query(query, values,
              async (err, result) => {

                if (result) {
                  helper.querySuccess(res, result.rows[0]);
                }

                if (err) {
                  helper.queryError(res, err);
                }
            });
            if (err) {
              helper.dbConnError(res, err);
            }
          });
        }
        catch(err){
          helper.authError(res, err);
        }

      //   db.client.connect(function(err) {

      //       db.client.query(query, values,
      //         async (err, result) => {

      //           try {
      //             helper.querySuccess(res, {status: "Success Adding Store", store: req.body.name});
      //           }

      //           catch (err) {
      //               helper.queryError(res, err);
      //             }
      //         });

      //       if (err) {

      //           helper.dbConnError(res, err);
      //       }

      // });
};


async function addWorker(req, res, next) {

        //verify user cookie -- or header??
        await auth.verifyToken(res, req, next);

        let timestamp = helper.getFormattedDate();

        let query = 'INSERT INTO workers(first_name, last_name, services, store_id, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6);'
        let values = [req.body.first_name, req.body.last_name, req.body.services, req.body.store_id, req.body.user_id, timestamp]

        db.client.connect(function(err) {

            db.client.query(query, values,
              async (err, result) => {

                try {

                  helper.querySuccess(res, {status: "Success Adding Worker", worker: {first_name: req.body.first_name, last_name: req.body.last_name}});
                }

                catch (err) {
                    helper.queryError(res, err);
                  }
              });

            if (err) {

                helper.dbConnError(res, err);
            }

      });
};


module.exports = {
  getStore: getStore,
  editStore: editStore,
  getStores: getStores,
    addStore: addStore,
    addWorker: addWorker
};
