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
  try {
    // await auth.verifyToken(req, res, next);
    let storeId = req.params.store_id
    let query = 'SELECT * FROM stores WHERE id=' + storeId

    db.client.connect(function (err) {
      // try to get the store
      db.client.query(query,
        async (err, result) => {
          if (err) {
            // check err if it's a string
            helper.queryError(res, err);
          }

          // were able to find the store
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows[0], "Successfully got Store!");
          }
          else {
            helper.queryError(res, "Could not Find Store!");
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getStores(req, res, next) {
  try {
    // await auth.verifyToken(req, res, next);
    let geocodeResult = await geocoder.geocode(req.query.address)
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
    if (categoryQueryArray.length == 0) {
      categoryQueryArray = categories
    }

    // convert the category array to a string literal array that postgres can understand
    var categoryQuery = '\'{';
    for (var i = 0; i < categoryQueryArray.length; i++) {
      if (i == categoryQueryArray.length - 1) {
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\"}\'";
      }
      else if (categoryQueryArray.length == 1) {
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\"}\'"
      }
      else {
        categoryQuery = categoryQuery + "\"" + categoryQueryArray[i] + "\", "
      }
    }

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *, ( 3959 * acos( cos( radians(` + lat + `) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(` + lng + `) ) + sin( radians(` + lat + `) ) * sin( radians( lat ) ) ) ) AS distance
                FROM stores
                WHERE ( 3959 * acos( cos( radians(` + lat + `) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(` + lng + `) ) + sin( radians(` + lat + `) ) * sin( radians( lat ) ) ) )
                  < ` + distance + ` AND category && ` + categoryQuery + `
                ORDER BY distance;`

    db.client.connect(function (err) {
      // try to get search results
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were able to get search results
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, "Successfully got Search Results!");
          }
          else {
            helper.queryError(res, "No Search Results!");
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getUserStores(req, res, next) {
  try {
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = `SELECT *
                FROM stores
                WHERE ` + req.params.store_id + ` = ANY(owners)`

    db.client.connect(function (err) {
      // try to get all stores registered to this user
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were successfuly able to get the users stores
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, "Successfully got User's Stores!");
          }
          else {
            helper.queryError(res, "No Store Results!");
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function editStore(req, res, next) {
  let failed = false
  let store = null
  if (req.body.name && req.body.street && req.body.city && req.body.state && req.body.zipcode && req.body.category && req.body.phone && req.body.services && req.body.owners && req.body.description && req.body.id) {
    try {
      await auth.verifyToken(req, res, next);
      // should fix this later so it only does it when the address has changed
      let geocodeResult = await geocoder.geocode({ address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode })
      let lat = geocodeResult[0].latitude
      let lng = geocodeResult[0].longitude
      let query = 'UPDATE stores SET name=$1, street=$2, city=$3, state=$4, zipcode=$5, category=$6, phone=$7, services=$8, owners=$9, description=$10, lat=$11, lng=$12 WHERE id=$13 RETURNING *'
      let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.category, req.body.phone, req.body.services, req.body.owners, req.body.description, lat, lng, req.body.id]

      // connect to the db
      db.client.connect(function (err) {
        // try to update the store
        db.client.query(query, values,
          async (err, result) => {
            if (err) {
              helper.queryError(res, err);
            }

            // we were successful in updating the store
            if (result && result.rows.length == 1) {
              console.log('Updated store, now moving to update hours if necessary')
              store = result.rows[0];
            }
            else {
              // there were no results from trying to update the stores table
              helper.queryError(res, "Unable to Update Store!");
            }
          });
        if (err) {
          helper.dbConnError(res, err);
        }
      });
    }
    catch (err) {
      helper.authError(res, err);
    }
    // Need to update hours for each day of the week. Client should only send us the days of the week that need updating. Not all 7. 
    let newHours = req.body.storeHours
    // Below is for scoping issues. Res is undefined below
    let resp = res
    if (newHours.length > 0) {
      let storeId = req.body.id
        ; (async (req, res) => {
          const hourDb = await db.client.connect();
          try {
            await hourDb.query("BEGIN");
            const query = 'UPDATE store_hours SET open_time=$1, close_time=$2 WHERE store_id=$3 and day_of_the_week=$4 RETURNING store_id';
            for (let i = 0; i < newHours.length; i++) {
              if (newHours[i] != null) {
                let storeHoursValues = [newHours[i].open_time, newHours[i].close_time, storeId, i]
                await hourDb.query(query, storeHoursValues);
              }
            }
            await hourDb.query("COMMIT");
          } catch (e) {
            await hourDb.query("ROLLBACK");
            console.log('##########Rolling Back#############')
            failed = true
            throw e;
          } finally {
            if (!failed) {
              helper.querySuccess(resp, store, 'Successfully updated store!');
            } else {
              helper.queryError(res, "Unable to Update Store!");
            }
            hourDb.release();
          }
        })().catch(e => helper.queryError(resp, e));
    } else {
      if (!failed) {
        // ******this is not working at the moment, need to wait for both queries to finish before sending this message....
        helper.querySuccess(res, store, 'Successfully updated store!');
      } else {
        helper.queryError(res, "Unable to Update Store!");
      }
    }
  }
  else {
    helper.queryError(res, "Missing Parameters!");
  }
};

async function addStore(req, res, next) {
  console.log("!!!! ENTER !!!!")
  if (req.body.name && req.body.street && req.body.city && req.body.state && req.body.zipcode && req.body.category && req.body.phone && req.body.description && req.body.owner_id) {
    try {
      await auth.verifyToken(req, res, next);
      console.log(req.body)
      let geocodeResult = await geocoder.geocode({ address: req.body.street, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode })
      console.log(geocodeResult)
      let timestamp = helper.getFormattedDate();
      let lat = geocodeResult[0].latitude
      let lng = geocodeResult[0].longitude
      let query = 'INSERT INTO stores(name, street, city, state, zipcode, created_at, category, phone, description, lat, lng, services, owners) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;'
      let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, timestamp, req.body.category, req.body.phone, req.body.description, lat, lng, [0], [req.body.owner_id]]
      console.log("About to insert values: ", values)
      console.log('down here')
      // connect to the db
      db.client.connect(function (err) {
        // try to add the store into the db
        db.client.query(query, values,
          async (err, result) => {
            if (err) {
              helper.queryError(res, err);
            }

            // we were successful in creating the store
            if (result && result.rows.length == 1) {
              store = result.rows[0];
              console.log("store is: ", store)
              console.log("continuing")
              let request = req
              let response = res
              let failed = false
                ; (async (req, res) => {
                  const hourDb = await db.client.connect();
                  try {
                    await hourDb.query("BEGIN");
                    const query = 'INSERT INTO store_hours(store_id, day_of_the_week, open_time, close_time) VALUES($1, $2, $3, $4) RETURNING store_id';
                    console.log("Starting query!")
                    console.log(request)
                    for (let i = 0; i < request.body.storeHours.length; i++) {
                      console.log("loop top")
                      console.log(request.body.storeHours[i])
                      if (request.body.storeHours[i] != null) {
                        let storeHoursValues = [store.id, i, request.body.storeHours[i].open_time, request.body.storeHours[i].close_time]
                        console.log("Store hours values is", storeHoursValues)
                        await hourDb.query(query, storeHoursValues);
                      }
                    }
                    console.log("about to commit ")
                    await hourDb.query("COMMIT");
                  } catch (e) {
                    console.log("error is: ", e)
                    await hourDb.query("ROLLBACK");
                    console.log('##########Rolling Back#############')
                    failed = true
                    throw e;
                  } finally {
                    if (!failed) {
                      helper.querySuccess(response, store, 'Successfully added new store with hours!');
                    } else {
                      helper.queryError(response, "Unable to create store because of hours!");
                    }
                    hourDb.release();
                  }
                })().catch(e => helper.queryError(response, e));

            }
            else {
              // there were no results from trying to insert into the stores table
              helper.queryError(res, "Unable to Insert Store!");
            }
          }
        );

        if (err) {
          helper.dbConnError(res, err);
        }
      });
    }
    catch (err) {
      helper.authError(res, err);
    }
  }
  else {
    helper.queryError(res, "Missing Parameters!");
  }
};

// Store worker functions

// NOTE: with nested queries like this, we need to revert successful queries that were made if the inner most one
// fails...
async function addWorker(req, res, next) {
  let store_id = null
  try {
    // lets verify that the user is logged in
    // should add verification to check they are the store owner, maybe can do this in the front end though...
    await auth.verifyToken(req, res, next);

    db.client.connect(function (err) {
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
            let values = [result.rows[0].first_name, result.rows[0].last_name, [0], req.params.store_id, result.rows[0].id, timestamp]

            // try to insert the worker in the workers table
            db.client.query(query, values,
              async (errFirst, resultFirst) => {
                if (errFirst) {
                  helper.queryError(res, errFirst);
                }

                // we were successful in inserting the worker
                if (resultFirst && resultFirst.rows.length == 1) {
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
                        values = [resultFirst.rows[0].id, req.params.store_id]
                        db.client.query(query, values,
                          async (errLast, resultLast) => {
                            if (errLast) {
                              helper.queryError(res, errLast);
                            }
                            // we were able to successfully update the workers in the stores table, return worker entry
                            if (resultLast && resultLast.rows.length == 1) {
                              let workerHours = req.body.workerHours
                              // Below is for scoping issues. Res is undefined below
                              let resp = res
                              let failed = false
                              let worker_id = req.body.id
                                ; (async (req, res) => {
                                  const hourDb = await db.client.connect();
                                  try {
                                    await hourDb.query("BEGIN");
                                    const query = 'INSERT INTO worker_hours(worker_id, day_of_the_week, start_time, end_time, store_id) VALUES ($1, $2, $3, $4, $5) RETURNING worker_id';
                                    for (let i = 0; i < workerHours.length; i++) {
                                      let workerHoursValues = [worker_id, i, workerHours[i].start_time, workerHours[i].end_time, store_id]
                                      await hourDb.query(query, workerHoursValues);
                                    }
                                    await hourDb.query("COMMIT");
                                  } catch (e) {
                                    await hourDb.query("ROLLBACK");
                                    console.log('##########Rolling Back#############')
                                    failed = true
                                    throw e;
                                  } finally {
                                    if (!failed) {
                                      helper.querySuccess(resp, resultFirst.rows[0], "Successfully Added Worker!");
                                    } else {
                                      helper.queryError(resp, "Unable to add worker!");
                                    }
                                    hourDb.release();
                                  }
                                })().catch(e => helper.queryError(resp, e));
                              if (!failed) {
                                // ******this is not working at the moment, need to wait for both queries to finish before sending this message....
                                helper.querySuccess(resp, resultFirst.rows[0], "Successfully Added Worker!");
                              } else {
                                helper.queryError(resp, "Unable to add worker!");
                              }
                            }
                            else {
                              // there was a problem updating the stores table
                              helper.queryError(res, "Could not Update Stores Table!");
                            }
                          }
                        )
                      }
                      else {
                        // there was a problem updating the users table
                        helper.queryError(res, "Could not Update Users Table!");
                      }
                    }
                  )
                }
                else {
                  // there was an error in inserting into the worker table
                  helper.queryError(res, "Could not Add Woker into the Workers Table!");
                }
              }
            );
          }
          else {
            // error, there were no results from trying to get the user to become worker from the db
            helper.queryError(res, "User does not Exist!");
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

async function editWorker(req, res, next) {
  let worker = null
  if (!req.body.noChange) {
    try {

      console.log("Body looks like: ", req.body)
      await auth.verifyToken(req, res, next);

      let query = 'UPDATE workers SET first_name=$1, last_name=$2, services=$3 WHERE id=$4 RETURNING *'
      let values = [req.body.first_name, req.body.last_name, req.body.services, req.params.id]

      db.client.connect(function (err) {
        // update the store worker
        db.client.query(query, values,
          async (err, result) => {
            if (err) {
              helper.queryError(res, err);
            }

            // we were successfuly able to update the worker
            if (result && result.rows.length == 1) {
              worker = results.rows[0]
            }
            else {
              helper.queryError(res, "Could not Edit Store Worker!");
            }
          });
        if (err) {
          helper.dbConnError(res, err);
        }
      });
    }
    catch (err) {
      helper.authError(res, err);
    }
  } else {
    worker = {
      id: req.body.id,
      store_id: req.body.store_id,
      services: req.body.services,
      user_id: req.body.user_id,
      created_at: req.body.created_at,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  }
  // Need to update hours for each day of the week. Client should only send us the days of the week that need updating. Not all 7. 
  let newHours = req.body.newHours
  // Below is for scoping issues. Res is undefined below
  let resp = res
  let failed = false
  if (newHours.length > 0) {
    let worker_id = req.body.id
      ; (async (req, res) => {
        const hourDb = await db.client.connect();
        try {
          await hourDb.query("BEGIN");
          const query = 'UPDATE worker_hours SET start_time=$1, end_time=$2 WHERE worker_id=$3 and day_of_the_week=$4 RETURNING worker_id';
          for (let i = 0; i < newHours.length; i++) {
            if (newHours[i] != null) {
              let newHoursValues = [newHours[i].start_time, newHours[i].end_time, worker_id, i]
              await hourDb.query(query, newHoursValues);
            }
          }
          await hourDb.query("COMMIT");
        } catch (e) {
          await hourDb.query("ROLLBACK");
          console.log('##########Rolling Back#############')
          failed = true
          throw e;
        } finally {
          if (!failed) {
            console.log("worker is: !!!!!", worker)
            helper.querySuccess(resp, worker, 'Successfully updated worker!');
          } else {
            helper.queryError(resp, "Unable to Update worker!");
          }
          hourDb.release();
        }
      })().catch(e => helper.queryError(resp, e));
  } else {
    if (!failed) {
      // ******this is not working at the moment, need to wait for both queries to finish before sending this message....
      helper.querySuccess(res, worker, 'Successfully updated worker!');
    } else {
      helper.queryError(res, "Unable to Update worker!");
    }
  }
};

// Store service functions

// NOTE: with nested queries like this, we need to revert successful queries that were made if the inner most one
// fails...
async function addService(req, res, next) {
  try {
    // lets verify that the user is logged in
    // should add verification to check they are the store owner, maybe can do this in the front end though...
    await auth.verifyToken(req, res, next);

    db.client.connect(function (err) {
      // check to see if the user exists
      let query = 'INSERT INTO services(name, cost, workers, store_id, category, description, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;'
      let values = [req.body.name, req.body.cost, req.body.workers, req.params.store_id, req.body.category, req.body.description, req.body.duration]
      db.client.query(query, values,
        async (errFirst, resultFirst) => {
          if (errFirst) {
            helper.queryError(res, errFirst);
          }

          // we were able to insert the service
          if (resultFirst && resultFirst.rows.length == 1) {
            // add the service to each workers services array
            for (var i = 0; i < req.body.workers.length; i++) {
              query = 'UPDATE workers SET services = array_append(services, $1) WHERE id=$2 RETURNING *'
              values = [resultFirst.rows[0].id, req.body.workers[i]]
              db.client.query(query, values,
                async (errSecond, resultSecond) => {
                  if (errSecond) {
                    helper.queryError(res, errSecond);
                  }
                  // we were not able to update this worker's services
                  if (!(resultSecond && resultSecond.rows.length == 1)) {
                    helper.queryError(res, "Could not Update Worker's Services!");
                  }
                }
              )
            }

            query = 'UPDATE stores SET services = array_append(services, $1) WHERE id=$2 RETURNING *'
            values = [resultFirst.rows[0].id, req.params.store_id]
            db.client.query(query, values,
              async (errLast, resultLast) => {
                if (errLast) {
                  helper.queryError(res, errLast);
                }
                // we were able to successfully update the store's services and are finished update db
                if (resultLast && resultLast.rows.length == 1) {
                  helper.querySuccess(res, resultFirst.rows[0], "Successfully Added Service!")
                }
                else {
                  helper.queryError(res, "Could not Update Store's Services!");
                }
              }
            )
          }
          else {
            helper.queryError(res, "Could not Insert Service!");
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

// Reusable worker/service functions
// table is either workers or services
async function getStoreItems(req, res, next, table) {
  try {
    await auth.verifyToken(req, res, next);

    // query for stores within the given distance, and that have any of the categories checked by the client
    let query = 'SELECT * FROM ' + table + ' WHERE store_id = $1'

    let values = [req.params.store_id]

    db.client.connect(function (err) {
      // try to get all items registered to this store
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were successfuly able to get the store items
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, "Successfully got Store Items!");
          }
          else {
            helper.queryError(res, "No Store Items");
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getStoreItem(req, res, next, table) {
  try {
    await auth.verifyToken(req, res, next);

    // query for store item
    let query = 'SELECT * FROM ' + table + ' WHERE id = $1'
    let values = [req.params.item_id]

    db.client.connect(function (err) {
      // try to get the store item based on id
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were successfuly able to get the store item
          if (result && result.rows.length == 1) {
            helper.querySuccess(res, result.rows[0], 'Sucessfully found store item!');
          }
          else {
            helper.queryError(res, "Could not find Store Item!");
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getWorkersSchedules(req, res, next) {
  console.log("about to get schedules for workers")
  // console.log("body looks like: ", req)
  try {
    await auth.verifyToken(req, res, next);

    // query for store item
    // add join to get worker ids from store id
    let query = 'SELECT * FROM worker_hours WHERE store_id = $1'
    let values = [req.params.store_id]

    console.log("query looks like: ", query)
    console.log("values looks like: ", values)
    // console.log(req)

    db.client.connect(function (err) {
      // try to get the store item based on id
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were successfuly able to get the store item
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, 'Successfully got worker schedules!');
          }
          else {
            helper.queryError(res, new Error("Could not find worker schedules!"));
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getIndividualWorkerHours(req, res, next) {
  try {
    await auth.verifyToken(req, res, next);

    // query for store item
    let query = 'SELECT start_time, end_time FROM worker_hours WHERE worker_id = $1'
    let values = [req.params.worker_id]

    console.log("getting worker hours with params", values)

    db.client.connect(function (err) {
      // try to get the store item based on id
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }

          // we were successfuly able to get the store item
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, 'Successfully got worker schedules!');
          }
          else if (result && result.rows.length == 0) {
            helper.querySuccess(res, result.rows, 'No worker schedule');
          }
          else {
            helper.queryError(res, new Error("Could not retrieve worker schedules!"));
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

async function getStoreHours(req, res, next) {
  try {
    await auth.verifyToken(req, res, next);

    // query for store item
    let query = 'SELECT open_time, close_time FROM store_hours WHERE store_id = $1 ORDER BY day_of_the_week'
    let values = [req.params.store_id]

    db.client.connect(function (err) {
      // try to get the store item based on id
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          // we were successfuly able to get the store item
          if (result && result.rows.length > 0) {
            helper.querySuccess(res, result.rows, 'Successfully got store hours!');
          }
          else {
            helper.queryError(res, new Error("Could not find store hours!"));
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
};

//Appointments
async function getAppointmentsByMonth(req, res, next) {
  try {
    await auth.verifyToken(req, res, next);

    // query for store appointments
    let query = 'SELECT worker_id, date, start_time, end_time, created_at FROM appointments WHERE store_id = $1 and EXTRACT(MONTH from date) = $2 ORDER BY date'
    let values = [req.params.store_id, req.params.month]
    db.client.connect(function (err) {
      // try to get the store appointments based on month
      db.client.query(query, values,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          // we were successfuly able to get the appointments for this month
          if (result) {
            helper.querySuccess(res, result.rows, 'Successfully got store appointments!');
          }
          else {
            helper.queryError(res, new Error("Could not find store appointments!"));
          }
        });
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
}

async function addAppointment(req, res, next) {
  try {
    await auth.verifyToken(req, res, next);
    // First, need to find what our appointment's group_id will be: 
    let query = 'SELECT group_id FROM appointments ORDER BY group_id DESC LIMIT 1'

    // connect to the db
    db.client.connect(function (err) {
      // try to get latest group_id from the appointments table
      db.client.query(query,
        async (err, result) => {
          if (err) {
            helper.queryError(res, err);
          }
          // we were successful in getting the latest group_id from the appointments tble
          if (result) {
            if(result.rows.length == 1) {
              insertAppointments(req, res, result.rows[0].group_id + 1)
            }  
          }
          else {
            helper.queryError(res, "Unable to query for appointment!");
          }
        }
      );
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch (err) {
    helper.authError(res, err);
  }
}

async function insertAppointments(req, res, group_id) {
  let timestamp = helper.getFormattedDate();
  let failed = false
  // Time to add to our appointment group one by one
  let appointments = req.body.appointments
  // Below is for scoping issues. Res is undefined below
  let resp = res
  let request = req
  if (appointments.length > 0) {
    let storeId = req.params.store_id
      ; (async (req, res) => {
        const hourDb = await db.client.connect();
        try {
          await hourDb.query("BEGIN");
          let query = 'INSERT INTO appointments(user_id, store_id, worker_id, service_id, date, created_at, start_time, end_time, price, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;'
          for (let i = 0; i < appointments.length; i++) {
            let values = [request.body.user_id, storeId, appointments[i].worker_id, appointments[i].service_id, appointments[i].date.substring(0, 18), timestamp, appointments[i].start_time, appointments[i].end_time, appointments[i].price, group_id]
            await hourDb.query(query, values);
          }
          await hourDb.query("COMMIT");
        } catch (e) {
          await hourDb.query("ROLLBACK");
          failed = true
          throw e;
        } finally {
          if (!failed) {
            helper.querySuccess(resp, group_id, 'Successfully added appointment!');
          } else {
            helper.queryError(res, "Unable to add appointments!");
          }
          hourDb.release();
        }
      })().catch(e => helper.queryError(resp, e));
  } else {
    if (!failed) {
      helper.querySuccess(res, store, 'Successfully added appointments!');
    } else {
      helper.queryError(res, "No appointments were given or failure to upload!");
    }
  }
};



module.exports = {
  getStore: getStore,
  editStore: editStore,
  getStores: getStores,
  addStore: addStore,
  getUserStores: getUserStores,
  addWorker: addWorker,
  editWorker: editWorker,
  getStoreItems: getStoreItems,
  getStoreItem: getStoreItem,
  addService: addService,
  getWorkersSchedules: getWorkersSchedules,
  getStoreHours: getStoreHours,
  getAppointmentsByMonth: getAppointmentsByMonth,
  addAppointment: addAppointment,
  getIndividualWorkerHours: getIndividualWorkerHours
};
