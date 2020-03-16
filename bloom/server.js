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
const helper = require('./helper.js')
const stores = require('./routes/stores.js');
const login = require('./routes/login.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());
// there might be a CORS issue, can't make a request in front end without event.preventDefault()
var allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  credentials: true,
  //CITATION: https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(cookieParser());
// app.all('*', ensureSecure)
app.use(serveStatic(path.join(__dirname, 'client', '/build')));


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

// //CITATION https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
const secret = process.env.JWT_SECRET;
const withAuth = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;


// Inserted this so that client-side routing works
// app.use(history({
//     verbose: true
// }));
// Documentation for connect-history-api-fallback requires this again...
// app.use(serveStatic(path.join(__dirname, '..', '/build')));

// function for errors on database connections

//
//
// app.get('/healthCheck', (req, res) => {
//   res.status(200)
//   res.send("Hello")
// })
//
// app.get('/getMerchantInfo/:id', (req, res) => {
//   let response = {
//     merchant: {
//       merchantId: 1,
//       merchantName: 'My Salon',
//       createdAt: new Date(),
//       type: 'Salon',
//       services: ['Nails', 'Hair', 'Makeup']
//     }
//   }
//   res.status(200)
//   res.json(response)
// })
//
// app.post('/postMenuItem', async (req, res) => {
//   let query = 'INSERT INTO menu_item(merchant_id, item_name, item_price, item_category) VALUES ($1, $2, $3, $4) RETURNING id;'
//   let values = [req.body.merchantId, req.body.itemName, req.body.itemPrice, req.body.itemCategory]
//
//   //connect to the db
//   pool.connect(function (err, client, done) {
//     if (err) {
//       dbConnError(res, err);
//       return;
//     }
//     client.query(query, values, //do the query
//       (err, resp) => {
//         if (err) {
//           queryError(res, err);
//           return;
//         }
//
//         res.status(200)
//         res.json(resp.rows[0].id)
//       });
//       client.release()
//   });
// });


app.post('/signUp', async (req, res) => {
  await login.signup(req, res);
});


app.post('/login', async (req, res) => {
  await login.login(req, res);
});

app.get('/checkToken', withAuth, function(req, res) {
  //if it gets in here, that means withAuth passed and your token is valid
  res.sendStatus(200);
});


//**** STORE ROUTES ****//

app.post('/addStore', withAuth, async (req, res, next) => {
  await stores.addStore(req, res, next);
});

// should include the store id? and should restrict so only owners can do this
app.post('/addWorker', withAuth, async (req, res, next) => {
  await stores.addWorker(req, res, next);
});


let port = process.env.PORT || 8081;

app.listen(port, function () {
    console.log('Node Server is listening at port', port);
});
