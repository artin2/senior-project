const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

async function login(req, res) {
  if (req.body.email && req.body.password) {
    let query = 'SELECT * from users WHERE email = $1;'
    let values = [req.body.email]

    db.client.connect(function(err) {
      db.client.query(query, values,
        async (err, result) => {
          if (result) {
            try {
              let passwordMatch = await auth.verifyHash(result.rows[0]["password"], req.body.password);

              if(passwordMatch) {

                await auth.generateToken(res, result.rows[0]);
                // res.send("SUCCESS");
                helper.querySuccess(res, {status: "Success Signing In", email: req.body.email});
              }
              else {
                res.send({status: "Password Provided is Incorrect"});
                res.status(400);
              }
            }
            catch (err) {
              console.log(err.toString())
              res.status(400).json(err.toString());
            }
          }
          else{
            console.log("We should handle this case...")
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

    try {
      hash = await auth.generateHash(req.body.password);
    } catch (err) {
      console.log("Couldn't Create Password Hash");
    }

    let query = 'INSERT INTO users(email, first_name, last_name, password, role, created_at, phone) VALUES ($1, $2, $3, $4, $5, $6, $7);'
    let values = [req.body.email, req.body.first_name, req.body.last_name, hash, req.body.role, timestamp, req.body.phone]

    db.client.connect(function(err) {
      db.client.query(query, values,
        (err, result) => {
        // console.log(res);
          if (result) {
            helper.querySuccess(res, {status: "Success Signing Up", email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name});
          }

          if (err) {
            helper.queryError(res, err);
          }

          // if (fields) console.log(fields);
      });
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
  //verify user cookie -- or header??
  try{
    // not sure if we are doing this correctly...
    await auth.verifyToken(req, res, next);
    // should fix this later so it only changes values that did change
    try {
      hash = await auth.generateHash(req.body.password);
    } catch (err) {
      console.log("Couldn't Create Password Hash");
    }

    // not sure how to update email, it is a unique attribute and seems you cant update a row's unique value
    let query = 'UPDATE users SET first_name=$1, last_name=$2, phone=$3, password=$4 WHERE id=$5 RETURNING *'
    let values = [req.body.first_name, req.body.last_name, req.body.phone, hash, req.body.id]

    db.client.connect(function(err) {
      db.client.query(query, values,
        async (err, result) => {
          if (result) {
            let user = result.rows[0]
            delete user.password
            const expiration = process.env.DB_ENV === 'dev' ? 1 : 7;
            const date = new Date();
            date.setDate(date.getDate() + expiration)

            res.cookie('user', user, {
              expires: date,
              secure: false, // set to true if your using https
              httpOnly: false,
              domain: 'localhost'
            })
            helper.querySuccess(res, user);
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


module.exports = {
  login: login,
  signup: signup,
  edit: edit
};
