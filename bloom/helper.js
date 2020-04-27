function getFormattedDate() {
  let date = new Date();
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function dbConnError(res, err) {
  console.error('Error acquiring client', err);
  res.status(400);
  res.send(err);
}

function queryError(res, err) {
  console.log('Query error', err);
  res.statusMessage = err;
  res.status(400).end();
}

function authError(res, err) {
  console.log('Auth error', err);
  res.status(400);
  res.send(err);
}

function querySuccess(res, content, msg) {
  console.log("Success", msg)
  res.statusMessage = msg
  res.status(200);
  res.json(content);
}

module.exports = {
  getFormattedDate: getFormattedDate,
  dbConnError: dbConnError,
  queryError: queryError,
  querySuccess: querySuccess,
  authError: authError
};
