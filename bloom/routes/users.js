const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

async function login(req, res) {
  if (req.body.email && req.body.password) {
    let query = 'SELECT * from users WHERE email = $1'
    let values = [req.body.email]

    db.client.connect((err, client, done) => {
      db.client.query(query, values, async (err, result) => {
        done()
          if (result && result.rows.length == 1) {
            try {
              let passwordMatch = await auth.verifyHash(result.rows[0]["password"], req.body.password);

              if(passwordMatch != false) {
                try {
                  let tokenGen = await auth.generateToken(res, result.rows[0]);
                  let resultUser = result.rows[0]
                  delete resultUser.password

                  // console.log(resultUser)

                  if(result.rows[0]["role"] == 2) {

                    query = 'SELECT id, store_id, services from workers WHERE user_id=$1'
                    values = [result.rows[0]["id"]]
                    await db.client.query(query, values, async (workerErr, workerRes) => {
                        if (workerErr) {
                          helper.queryError(res, workerErr);
                        }
                        else if (workerRes && workerRes.rows.length == 1) {
                          resultUser["worker_id"] = workerRes.rows[0]["id"]
                          resultUser["store_id"] = workerRes.rows[0]["store_id"]
                          resultUser["services"] = workerRes.rows[0]["services"]

                          helper.querySuccess(res, { user: resultUser, token: tokenGen }, "Successfully Logged In!");

                        }
                        // console.log(resultUser)

                    })
                  }
                  else {
                    helper.querySuccess(res, { user: resultUser, token: tokenGen }, "Successfully Logged In!");
                  }

                }
                catch (err) {
                  helper.queryError(res, err);
                }
              }
              else {
                helper.queryError(res, "Password Provided is incorrect");
              }
            }
            catch (err) {
              helper.queryError(res, err);
            }
          }
          else{
            helper.queryError(res, "Could not Find User!");
          }

          if (err) {
            helper.queryError(res, err);
          }
        }
      );

      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  else {
    res.send('Missing a Parameter');
    res.status(400);
  }
}

async function signup(req, res) {
  if (req.body.email && req.body.password && req.body.first_name && req.body.last_name) {
    let timestamp = helper.getFormattedDate();
    let hash;

    // try to generate password hash
    try {
      hash = await auth.generateHash(req.body.password);
    } catch (err) {
      helper.queryError(res, "Could not Create Password Hash");
    }
    let query = 'INSERT INTO users(email, first_name, last_name, password, role, created_at, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;'
    let values = [req.body.email, req.body.first_name, req.body.last_name, hash, req.body.role, timestamp, req.body.phone]

    db.client.connect((err, client, done) => {
      // try to add user to user table
      db.client.query(query, values, async (err, result) => {
        done()
          if (err) {
            helper.queryError(res, err);
          }

          // if we were able to add the user successfuly
          if (result && result.rows.length == 1) {
            try {
              // for some reason the cookie is not being attatched to the response...
              // cookie is successfuly generated for sure tho..
              // await auth.generateToken(res, result.rows[0]);
              let tokenGen = await auth.generateToken(res, result.rows[0]);
              delete result.rows[0].password
              helper.querySuccess(res, {user: result.rows[0], token: tokenGen}, "Successfully Created User!");
            }
            catch (err) {
              helper.queryError(res, err);
            }
          }
          else{
            helper.queryError(res, "Could not Create User!");
          }
        }
      );
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  else {
    res.send('Missing a Parameter');
    res.status(400);
  }
}

async function edit(req, res, next) {
  try{
    // should fix this later so it only changes values that did change
    try {
      hash = await auth.generateHash(req.body.password);
    } catch (err) {
      helper.queryError(res, "Could not Create Password Hash");
    }

    // not sure how to update email, it is a unique attribute and seems you cant update a row's unique value
    let query = 'UPDATE users SET first_name=$1, last_name=$2, phone=$3, password=$4 WHERE id=$5 RETURNING *'
    let values = [req.body.first_name, req.body.last_name, req.body.phone, hash, req.body.id]

    db.client.connect((err, client, done) => {
      // query to update the user
      db.client.query(query, values, (err, result) => {
          // if the user is a worker, update the dependant worker information
          if(req.body.role == '2'){
            if (err) {
              helper.queryError(res, err);
            }

            // if we were able to successfuly update the user
            if (result && result.rows.length) {
              query = "UPDATE workers SET first_name=$1, last_name=$2 WHERE user_id=$3 RETURNING *"
              values = [req.body.first_name, req.body.last_name, req.body.id]

              db.client.query(query, values, (errLast, resultLast) => {
                done()
                if (errLast) {
                  helper.queryError(res, errLast);
                }

                if (resultLast && resultLast.rows.length) {
                  let user = result.rows[0]
                  delete user.password
                  const expiration = process.env.DB_ENV === 'dev' ? 1 : 7;
                  const date = new Date();
                  date.setDate(date.getDate() + expiration)
    
                  // update the cookie for this user
                  res.cookie('user', user, {
                    expires: date,
                    secure: false, // set to true if your using https
                    httpOnly: false,
                    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_PROD : process.env.DEV
                  })
                  helper.querySuccess(res, user, "Successfully Updated User!");
                }
                else{
                  helper.queryError(res, "Could not update worker table!")
                }
              })
            }
            else{
              helper.queryError(res, "Could not update user table!")
            }
          }
          else{
            done()
            if (err) {
              helper.queryError(res, err);
            }

            // if we were able to successfuly update the user
            if (result && result.rows.length) {
              let user = result.rows[0]
              delete user.password
              const expiration = process.env.DB_ENV === 'dev' ? 1 : 7;
              const date = new Date();
              date.setDate(date.getDate() + expiration)

              // update the cookie for this user
              res.cookie('user', user, {
                expires: date,
                secure: false, // set to true if your using https
                httpOnly: false,
                domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN_PROD : process.env.DEV
              })
              helper.querySuccess(res, user, "Successfully Updated User!");
            }
            else{
              helper.queryError(res, "Could not update user!")
            }
          }
        }
      );
      
      if (err) {
        helper.dbConnError(res, err);
      }
    });
  }
  catch(err){
    helper.queryError(res, "Some sort of error!");
  }
};

module.exports = {
  login: login,
  signup: signup,
  edit: edit
};
