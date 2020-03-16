const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');


async function addStore(req, res, next) {

        //verify user cookie -- or header??
        try{
          // not sure if we are doing this correctly...
          await auth.verifyToken(req, res, next);
          let timestamp = helper.getFormattedDate();
          // need to update this to include description and phone number, and when we add a store, service is not created, so take that out
          // for now going to insert service and owners manually until someone updates db
          let query = 'INSERT INTO stores(name, street, city, state, zipcode, created_at, category, phone, service, owners) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, name, street, city, state, zipcode, created_at, category, phone, service, owners;'
          let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, timestamp, req.body.category, req.body.phone, [0], [0]]

          db.client.connect(function(err) {
            db.client.query(query, values,
              async (err, result) => {

                if (result) {
                  console.log(result)
                  helper.querySuccess(res, {status: "Success Adding Store", store: result.rows[0]});
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


async function updateStore(req, res, next) {

        //verify user cookie -- or header??
        await auth.verifyToken(res, req, next);

        let query = 'UPDATE stores SET name = $1, street = $2, city = $3, state = $4, zipcode = $5, category = $6, service = $7, phone = $8, workers = $9, owners = $10 WHERE id = $11;'
        let values = [req.body.name, req.body.street, req.body.city, req.body.state, req.body.zipcode, req.body.category, req.body.service, req.body.phone, req.body.workers, req.body.owners, req.body.id];

        db.client.connect(function(err) {

            db.client.query(query, values,
              async (err, result) => {

                try {

                  helper.querySuccess(res, {status: "Success Updating Store", store: req.body.name});
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
    addStore: addStore,
    addWorker: addWorker,
    updateStore: updateStore
};
