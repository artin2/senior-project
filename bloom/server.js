const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const path = require("path")
const passport = require('passport');
const db = require('./db.js');
const auth = require('./auth.js');



require('dotenv').config();

function getFormattedDate() {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}


// //CITATION: https://stackoverflow.com/questions/40876599/express-js-force-https-ssl-redirect-error-too-many-redirects
// //HTTPS redirect middleware
// function ensureSecure(req, res, next) {
//   //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
//   if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
//     //Serve Vue App by passing control to the next middleware
//     next();
//   } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
//     //Redirect if not HTTP with original request URL
//     res.redirect('https://' + req.hostname + req.url);
//   }
// }


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(cookieParser());
// app.all('*', ensureSecure)
app.use(serveStatic(path.join(__dirname, 'client', '/build')));
// Inserted this so that client-side routing works
// app.use(history({
//     verbose: true
// }));
// Documentation for connect-history-api-fallback requires this again...
// app.use(serveStatic(path.join(__dirname, '..', '/build')));

// function for errors on database connections
function dbConnError(res, err) {
  console.error('Error acquiring client', err, err.message, err.stack);
  res.status(400);
  res.send(err);
}

// function for query errors
function queryError(res, err) {
  console.log('Query error', err, err.message, err.stack);
  res.status(400);
  res.send(err);
}


app.get('/healthCheck', (req, res) => {
  res.status(200)
  res.send("Hello")
})

app.get('/getMerchantInfo/:id', (req, res) => {
  let response = {
    merchant: {
      merchantId: 1,
      merchantName: 'My Salon',
      createdAt: new Date(),
      type: 'Salon',
      services: ['Nails', 'Hair', 'Makeup']
    }
  }
  res.status(200)
  res.json(response)
})

app.post('/postMenuItem', async (req, res) => {
  let query = 'INSERT INTO menu_item(merchant_id, item_name, item_price, item_category) VALUES ($1, $2, $3, $4) RETURNING id;'
  let values = [req.body.merchantId, req.body.itemName, req.body.itemPrice, req.body.itemCategory]

  //connect to the db
  pool.connect(function (err, client, done) {
    if (err) {
      dbConnError(res, err);
      return;
    }
    client.query(query, values, //do the query
      (err, resp) => {
        if (err) {
          queryError(res, err);
          return;
        }

        res.status(200)
        res.json(resp.rows[0].id)
      });
      client.release()
  });
});


app.post('/signUp', async (req, res) => {
    if (req.query.email && req.query.password && req.query.first_name && req.query.last_name) {

        let timestamp = getFormattedDate();
        let hash;

        try {

          hash = await auth.generateHash(req.query.password);

        } catch (err) {
          console.log("Couldn't Create Password Hash");
        }

        let query = 'INSERT INTO users(email, first_name, last_name, password, role, created_at, phone) VALUES ($1, $2, $3, $4, $5, $6, $7);'
        let values = [req.query.email, req.query.first_name, req.query.last_name, hash, req.query.role, timestamp, req.query.phone]

        db.client.connect(function(err) {

            db.client.query(query, values,
              (err, result) => {

                // console.log(res);
                if (result) {
                  res.send({status: "Success Signing Up", email: req.query.email, first_name: req.query.first_name, last_name: req.query.last_name});
                  res.status(200)
                }

                if (err) {
                  console.log("Error Signing Up:", err);
                  res.status(500).json(err.toString());
                }

                // if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a Parameter');
    }
});


app.post('/login', async (req, res) => {
    if (req.query.email && req.query.password) {

        let query = 'SELECT password, id, first_name, last_name from users WHERE email = $1;'
        let values = [req.query.email]

        db.client.connect(function(err) {

            db.client.query(query, values,
              async (err, result) => {

                if (result) {

                  try {

                    let passwordMatch = await auth.verifyHash(result.rows[0]["password"], req.query.password);

                    if(passwordMatch) {

                      await auth.generateToken(res, result.rows[0]["id"], result.rows[0]["first_name"], result.rows[0]["last_name"]);

                      res.send({status: "Success Signing In", email: req.query.email});
                      res.status(200)
                    }
                    else {
                      res.send({status: "Password Provided is Incorrect"});

                    }
                  }

                  catch (err) {
                    console.log("User is Not Found");
                    res.status(500).json(err.toString());
                  }
                }

                if (err) {

                  console.log("Error:", err);
                  res.status(500).json(err.toString());

                }

                // if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a Parameter');
    }
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });



let port = process.env.PORT || 8081;

app.listen(port, function () {
    console.log('Node Server is listening at port', port);
});
