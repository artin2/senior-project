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
const users = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const s3 = require('./routes/s3');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());
// there might be a CORS issue, can't make a request in front end without event.preventDefault()
// var allowedOrigins = ['http://localhost:3000'];
// app.use(cors({
//   credentials: true,
//   //CITATION: https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
//   origin: function(origin, callback){
//     // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

app.use(cookieParser());
// app.all('*', ensureSecure)
app.use(serveStatic(path.join(__dirname, 'client', '/build')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

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
    console.log("No token")
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log("Wrong token")
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
  await users.signup(req, res);
});

app.post('/login', async (req, res) => {
  await users.login(req, res);
});

app.post('/users/:id', async (req, res, next) => {
  await users.edit(req, res, next);
});


app.get('/checkToken', withAuth, function(req, res) {
  //if it gets in here, that means withAuth passed and your token is valid
  res.sendStatus(200);
});


//**** STORE ROUTES ****//

app.get('/stores/users/:store_id', withAuth, async (req, res, next) => {
  await stores.getUserStores(req, res, next);
});

//should this be a patch?
app.post('/stores/edit/:store_id', withAuth, async (req, res, next) => {
  await stores.editStore(req, res, next);
});

// store services
app.post('/stores/addService/:store_id', withAuth, async (req, res, next) => {
  await stores.addService(req, res, next);
});

app.post('/stores/:store_id/services/:item_id', withAuth, async (req, res, next) => {
  // **still need to implement
  await stores.editStoreService(req, res, next);
});

app.get('/stores/:store_id/services/:item_id', withAuth, async (req, res, next) => {
  await stores.getStoreItem(req, res, next, "services");
});

app.get('/stores/:store_id/services', withAuth, async (req, res, next) => {
  await stores.getStoreItems(req, res, next, "services");
});

// store workers
app.post('/stores/addWorker/:store_id', withAuth, async (req, res, next) => {
  await stores.addWorker(req, res, next);
});

app.post('/stores/:store_id/workers/:item_id', withAuth, async (req, res, next) => {
  await stores.editWorker(req, res, next);
});

app.get('/stores/:store_id/workers/:item_id', withAuth, async (req, res, next) => {
  await stores.getStoreItem(req, res, next, "workers");
});

app.get('/stores/:store_id/workers', withAuth, async (req, res, next) => {
  await stores.getStoreItems(req, res, next, "workers");
});

app.get('/stores/:store_id/workers/schedules', withAuth, async (req, res, next) => {
  await stores.getWorkersSchedules(req, res, next);
});

app.get('/stores/:store_id/workers/:worker_id/hours', withAuth, async (req, res, next) => {
  await stores.getIndividualWorkerHours(req, res, next);
});

//stores
app.get('/stores/:store_id', withAuth, async (req, res, next) => {
  await stores.getStore(req, res, next);
});

app.get('/stores', withAuth, async (req, res, next) => {
  await stores.getStores(req, res, next);
});

app.post('/addStore', withAuth, async (req, res, next) => {
  await stores.addStore(req, res, next);
});

app.get('/stores/:store_id/storeHours', withAuth, async (req, res, next) => {
  await stores.getStoreHours(req, res, next);
});

//s3
app.post('/getPresignedUrl', withAuth, async (req, res) => {
  await s3.getPresignedUploadUrl(req, res);
});

app.post('/getImages', withAuth, async (req, res) => {
  await s3.getImages(req, res);
});

//Need to fix this: not sure what name of cookie is
app.get('/clearCookie', (req, res) => {
  res.clearCookie('jwt_token').end();
  res.send('User Logged Out Successfully');
});


let port = process.env.PORT || 8081;

app.listen(port, function () {
    console.log('Node Server is listening at port', port);
});
