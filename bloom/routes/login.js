

const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

async function login(req, res) {

    if (req.body.email && req.body.password) {

        let query = 'SELECT password, id, first_name, last_name from users WHERE email = $1;'
        let values = [req.body.email]

        db.client.connect(function(err) {

            db.client.query(query, values,
              async (err, result) => {

                if (result) {

                  try {

                    let passwordMatch = await auth.verifyHash(result.rows[0]["password"], req.body.password);

                    if(passwordMatch) {

                      await auth.generateToken(res, result.rows[0]["id"], result.rows[0]["first_name"], result.rows[0]["last_name"]);

                      helper.querySuccess(res, {status: "Success Signing In", email: req.body.email});

                    }
                    else {
                      res.send({status: "Password Provided is Incorrect"});
                      res.status(400);
                    }
                  }

                  catch (err) {
                    console.log("User is Not Found");
                    res.status(400).json(err.toString());
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
    } else {
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
    } else {
        res.send('Missing a Parameter');
        res.status(400);
    }

}

module.exports = {
    login: login,
    signup: signup,

};
