const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY
};
const geocoder = NodeGeocoder(options);

async function getStore(req, res, next) {
  try{
    await auth.verifyToken(req, res, next);
    let storeId = req.params.id
    let query = 'SELECT * FROM stores WHERE id=' + storeId

    db.client.connect(function(err) {
      // try to get the store
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // were able to find the store
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows[0]);
          }
          else{
            helper.queryError(res, new Error("Could not find store!"));
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
  try{
    await auth.verifyToken(req, res, next);
    let geocodeResult = await geocoder.geocode({address: req.query.street, city: req.query.city, state: req.query.state, zipcode: req.query.zipcode})
    let lat = geocodeResult[0].latitude
    let lng = geocodeResult[0].longitude
    let distance = req.query.distance
    let categories = ['Nails', 'Hair']
    let categoryQueryArray = []

    // check to see which categories where marked as true
    let j = categories.length
    while (j--) {
      cat = categories[j].toLowerCase()
      if (req.query[cat] == "true") { 
        categoryQueryArray.push(categories[j])
      }
    }

    // if client didn't mark any categories then they want all of them
    if(categoryQueryArray.length == 0){
      categoryQueryArray = categories
    }

    // convert the category array to a string literal array that postgres can understand
    var categoryQuery = '\'{';
    for(var i = 0; i < categoryQueryArray.length; i++) {
      if(i == categoryQueryArray.length - 1){
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\"}\'";
      }
      else if(categoryQueryArray.length == 1){
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\"}\'"
      }
      else{
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\", "
      }
    }

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *, ( 3959 * acos( cos( radians(` + lat + `) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(` + lng + `) ) + sin( radians(` + lat + `) ) * sin( radians( lat ) ) ) ) AS distance
                FROM stores
                WHERE ( 3959 * acos( cos( radians(` + lat + `) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(` + lng + `) ) + sin( radians(` + lat + `) ) * sin( radians( lat ) ) ) )
                  < ` + distance + ` AND category && ` + categoryQuery + `
                ORDER BY distance;`

    db.client.connect(function(err) {
      // try to get search results
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were able to get search results
          if (result && result.rows.length > 0) {
              helper.querySuccess(res, result.rows);
          }
          else{
            helper.queryError(res, new Error("No search results!"));
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

async function getStoreWorkers(req, res, next) {
  try{
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *
                FROM workers
                WHERE store_id = $1`

    let values = [req.params.id]

    db.client.connect(function(err) {
      // try to get all stores registered to this user
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          
          // we were successfuly able to get the store workers
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows);
          }
          else{
            helper.queryError(res, new Error("No store workers!"));
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

async function getStoreWorker(req, res, next) {
  try{
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *
                FROM workers
                WHERE id = $1`

    let values = [req.params.worker_id]
    console.log(values)

    db.client.connect(function(err) {
      // try to get all stores registered to this user
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          
          // we were successfuly able to get the store workers
          if (result && result.rows.length == 1) {
            helper.querySuccess(res, result.rows);
          }
          else{
            helper.queryError(res, new Error("Could not find store worker!"));
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

async function editStoreWorker(req, res, next) {
  try{
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = 'UPDATE workers SET services=$1 WHERE id=$2 RETURNING *'
    let values = [req.body.services, req.params.worker_id]

    db.client.connect(function(err) {
      // try to get all stores registered to this user
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          
          // we were successfuly able to get the store workers
          if (result && result.rows.length == 1) {
            helper.querySuccess(res, result.rows[0]);
          }
          else{
            helper.queryError(res, new Error("Could not edit store worker!"));
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

async function getUserStores(req, res, next) {
  try{
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *
                FROM stores
                WHERE ` + req.params.id + ` = ANY(owners)`

    db.client.connect(function(err) {
      // try to get all stores registered to this user
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          
          // we were successfuly able to get the users stores
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows);
          }
          else{
            helper.queryError(res, new Error("No store results!"));
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
  if(req.body.name && req.body.street && req.body.city && req.body.state && req.body.zipcode && req.body.category && req.body.phone && req.body.services && req.body.owners && req.body.description && req.body.pictures && req.body.id){
    try{
      await auth.verifyToken(req, res, next);
      // should fix this later so it only does it when the address has changed
      let geocodeResult = await geocoder.geocode({address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode})
      let lat = geocodeResult[0].latitude
      let lng = geocodeResult[0].longitude
      let query = 'UPDATE stores SET name=$1, street=$2, city=$3, state=$4, zipcode=$5, category=$6, phone=$7, services=$8, owners=$9, description=$10, pictures=$11, lat=$12, lng=$13 WHERE id=$14 RETURNING *'
      let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.category, req.body.phone, req.body.services, req.body.owners, req.body.description, req.body.pictures, lat, lng, req.body.id]

      // connect to the db
      db.client.connect(function(err) {
        // try to update the store
        db.client.query(query, values,
          async (err, result) => {
            if (err) {
              helper.queryError(res, err);
            }

            // we were successful in updating the store
            if (result && result.rows.length == 1) {
              helper.querySuccess(res, result.rows[0]);
            }
            else{
              // there were no results from trying to update the stores table
              helper.queryError(res, new Error("Unable to update store!"));
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
  }
  else {
    // not sure if this is correct
    res.send("Missing parameter(s).")
    res.send(400)
  }
};

async function addStore(req, res, next) {
  if(req.body.name && req.body.street && req.body.city && req.body.state && req.body.zipcode && req.body.category && req.body.phone && req.body.description && req.body.pictures && req.body.owner_id){
    try{
      await auth.verifyToken(req, res, next);
      let geocodeResult = await geocoder.geocode({address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode})
      let timestamp = helper.getFormattedDate();
      let lat = geocodeResult[0].latitude
      let lng = geocodeResult[0].longitude
      let query = 'INSERT INTO stores(name, street, city, state, zipcode, created_at, category, phone, description, pictures, lat, lng, services, owners) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;'
      let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, timestamp, req.body.category, req.body.phone, req.body.description, req.body.pictures, lat, lng, [0], [req.body.owner_id]]

      // connect to the db
      db.client.connect(function(err) {
        // try to add the store into the db
        db.client.query(query, values,
          async (err, result) => {
            if (err) {
              helper.queryError(res, err);
            }

            // we were successful in creating the store
            if (result && result.rows.length == 1) {
              helper.querySuccess(res, result.rows[0]);
            }
            else{
              // there were no results from trying to insert into the stores table
              helper.queryError(res, new Error("Unable to insert store!"));
            }
          }
        );
        
        if (err) {
          helper.dbConnError(res, err);
        }
      });
    }
    catch(err){
      helper.authError(res, err);
    }
  }
  else{
    // not sure if this is correct
    res.send("Missing parameter(s).")
    res.send(400)
  }
};


// NOTE: with nested queries like this, we need to revert successful queries that were made if the inner most one
// fails...
async function addWorker(req, res, next) {
  try {
    // lets verify that the user is logged in
    // should add verification to check they are the store owner, maybe can do this in the front end though...
    await auth.verifyToken(req, res, next);

    db.client.connect(function(err) {
      // check to see if the user exists
      let query = 'SELECT * from users WHERE email = $1'
      let values = [req.body.email]
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          // if there is exactly one result, we have a valid potential worker, proceed to inserting them
          if (result && result.rows.length == 1) {
            let timestamp = helper.getFormattedDate();
            query = 'INSERT INTO workers(first_name, last_name, services, store_id, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;'
            let values = [result.rows[0].first_name, result.rows[0].last_name, [0], req.params.id, result.rows[0].id, timestamp]
            
            // try to insert the worker in the workers table
            db.client.query(query, values,
              async (errFirst, resultFirst) => {
                if (errFirst) {
                  helper.queryError(res, errFirst);
                }

                // we were successful in inserting the worker
                if(resultFirst && resultFirst.rows.length == 1){
                  // now we have to update the user row to make their role worker
                  // note, may want to update query to this...
                  // query = 'UPDATE users SET role = array_append(role, 1) WHERE id=$2 RETURNING *'
                  query = 'UPDATE users SET role=1 WHERE email=$1 RETURNING *'
                  values = [req.body.email]
                  db.client.query(query, values,
                    async (errSecond, resultSecond) => {
                      if (errSecond) {
                        helper.queryError(res, errSecond);
                      }
                      // we were able to successfully update the workers role in the user's table
                      if (resultSecond && resultSecond.rows.length == 1) {
                        // now we have to update the user row to make their role worker
                        // note, may want to update query to this...
                        query = 'UPDATE stores SET workers = array_append(workers, $1) WHERE id=$2 RETURNING *'
                        values = [resultFirst.rows[0].id, req.params.id]
                        db.client.query(query, values,
                          async (errLast, resultLast) => {
                            if (errLast) {
                              helper.queryError(res, errLast);
                            }
                            // we were able to successfully update the workers in the stores table, return worker entry
                            if (resultLast && resultLast.rows.length == 1) {
                              helper.querySuccess(res, resultFirst.rows[0]);
                            }
                            else{
                              // there was a problem updating the stores table 
                              helper.queryError(res, new Error("Could not update Stores table!"));
                            }
                          }
                        )
                      }
                      else{
                        // there was a problem updating the users table 
                        helper.queryError(res, new Error("Could not update Users table!"));
                      }
                    }
                  )
                }
                else {
                  // there was an error in inserting into the worker table
                  helper.queryError(res, new Error("Could not enter into Workers table!"));
                }
              }
            );
          }
          else{
            // error, there were no results from trying to get the user to become worker from the db
            helper.queryError(res, new Error("User does not exist!"));
          }
        }
      );

      if (err) {
        helper.dbConnError(res, err);
      }
    });
  } catch (err) {
    helper.authError(res, err);
  }
};

// NOTE: with nested queries like this, we need to revert successful queries that were made if the inner most one
// fails...
async function addService(req, res, next) {
  try {
    // lets verify that the user is logged in
    // should add verification to check they are the store owner, maybe can do this in the front end though...
    await auth.verifyToken(req, res, next);

    db.client.connect(function(err) {
      // check to see if the user exists
      query = 'INSERT INTO services(name, cost, workers, store_id, category, description, pictures, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;'
      let values = [req.body.name, req.body.cost, req.body.workers, req.body.store_id, req.body.category, req.body.description, req.body.pictures, req.body.duration]
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were able to insert the service
          if (result && result.rows.length == 1) {
            helper.querySuccess(res, result.rows[0]);
          }
          else{
            helper.queryError(res, new Error("Could not insert service!"));
          }
        }
      );

      if (err) {
        helper.dbConnError(res, err);
      }
    });
  } catch (err) {
    helper.authError(res, err);
  }
};

module.exports = {
  getStore: getStore,
  editStore: editStore,
  getStores: getStores,
  addStore: addStore,
  addWorker: addWorker,
  getUserStores: getUserStores,
  getStoreWorkers: getStoreWorkers,
  getStoreWorker: getStoreWorker,
  editStoreWorker: editStoreWorker,
  addService: addService
};
