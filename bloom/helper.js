


function getFormattedDate() {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}


function dbConnError(res, err) {
  console.error('Error acquiring client', err, err.message, err.stack);
  res.status(400);
  res.send(err);
}


function queryError(res, err) {
  console.log('Query error', err, err.message, err.stack);
  res.status(400);
  res.send(err);
}

function querySuccess(res, msg) {
  console.error(msg.status);
  res.status(200);
  res.send(msg);
}


module.exports = {
    getFormattedDate: getFormattedDate,
    dbConnError: dbConnError,
    queryError: queryError,
    querySuccess: querySuccess
};
