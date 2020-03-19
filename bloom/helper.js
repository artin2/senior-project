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
  res.status(400);
  res.send(err);
}

function authError(res, err) {
  console.log('Auth error', err);
  res.status(400);
  res.send(err);
}

function querySuccess(res, msg) {
  res.status(200);
  res.json(msg);
  // res.send(msg);
}

module.exports = {
  getFormattedDate: getFormattedDate,
  dbConnError: dbConnError,
  queryError: queryError,
  querySuccess: querySuccess,
  authError: authError
};
