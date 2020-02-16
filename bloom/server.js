const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const path = require("path")

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

let port = process.env.PORT || 8081;

app.listen(port, function () {
    console.log('Node js at port', port);
});
