const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

async function getAppointmentsForDisplay(req, res) {
  console.log("about to get appointments")
  console.log("group_id is: ", req.params.group_id)
  let service_ids = []
  let worker_ids = []
  let store_id = 0
  let cost = 0
  let start_time = 0
  let end_time = 0
  let user_id = 0

  db.client.connect(function (err) {
    let query = 'SELECT user_id, store_id, worker_id, service_id, date, start_time, end_time, price FROM appointments WHERE group_id=$1 ORDER BY start_time ASC'
    let values = [req.params.group_id]
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the appointments
        if (resultFirst) {
          console.log("first query was successful")
          start_time = resultFirst.rows[0].start_time
          end_time = resultFirst.rows[resultFirst.rows.length - 1].end_time
          store_id = resultFirst.rows[0].store_id
          for (let i = 0; i < resultFirst.rows.length; i++) {
            cost += resultFirst.rows[i].price
            service_ids.push(resultFirst.rows[i].service_id)
            worker_ids.push(resultFirst.rows[i].worker_id)
          }
          user_id = resultFirst.rows[0].user_id
          getWorkerNames(res, resultFirst.rows, user_id, start_time, end_time, store_id, cost, service_ids, worker_ids)
        }
        else {
          helper.queryError(res, "Could not retrieve appointments!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
};

function getWorkerNames(res, appointment, user_id, start_time, end_time, store_id, cost, service_ids, worker_ids) {
  let worker_names = []
  console.log("about to get names")
  console.log("previous results go us: ")
  console.log("appointment: ", appointment)
  console.log("start_time: ", start_time)
  console.log("end_time: ", end_time)
  console.log("store_id: ", store_id)
  console.log("cost: ", cost)
  console.log("service_ids: ", service_ids)
  console.log("worker_ids: ", worker_ids)
  
  db.client.connect(function (err) {
    var params = [];
    for(var i = 1; i <= worker_ids.length; i++) {
      params.push('$' + i);
    }
    //get the worker names that serve our appointment
    query = 'SELECT first_name, last_name FROM workers WHERE id IN (' + params.join(',') + ')'
    values = worker_ids
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the worker names
        if (resultFirst) {
          worker_names = resultFirst.rows.map(name => name.first_name+ ' ' + name.last_name)
          getServiceNames(res, appointment, user_id, start_time, end_time, store_id, cost, service_ids, worker_names)
        }
        else {
          helper.queryError(res, "Could not retrieve worker names!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
}

function getServiceNames(res, appointment, user_id, start_time, end_time, store_id, cost, service_ids, worker_names) {
  console.log("about to get service names")
  console.log("previous results go us: ")
  console.log("worker_names: ", worker_names)
  let service_names = []
  
  db.client.connect(function (err) {
    var params = [];
    for(var i = 1; i <= service_ids.length; i++) {
      params.push('$' + i);
    }
    //get the service names for our appointment
    query = 'SELECT name FROM services WHERE id IN (' + params.join(',') + ')'
    values = service_ids
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the service names
        if (resultFirst) {
          service_names = resultFirst.rows.map(service => service.name)
          getStoreName(res, appointment, user_id, start_time, end_time, store_id, cost, service_names, worker_names)
        }
        else {
          helper.queryError(res, "Could not retrieve service names!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
}

function getStoreName(res, appointment, user_id, start_time, end_time, store_id, cost, service_names, worker_names) {
  console.log("about to get store name")
  console.log("previous results go us: ")
  console.log("service_names: ", service_names)
  let store_name = ''
  
  db.client.connect(function (err) {
    //get the store name
    query = 'SELECT name FROM stores WHERE id=$1'
    values = [store_id]
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the store name
        if (resultFirst) {
          store_name = resultFirst.rows[0].name
          let response = {
            appointment: appointment,
            user_id: user_id,
            start_time: start_time, 
            end_time: end_time,
            store_name: store_name,
            cost: cost,
            service_names: service_names,
            workers: worker_names
          }
          console.log("everything sucessful, sending: ", response)
          helper.querySuccess(res, response, 'Successfully got appointment display info!');
        }
        else {
          helper.queryError(res, "Could not retrieve the store name!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
}

async function deleteAppointment(req, res) {
  console.log("about to delete appointments")
  console.log("group_id is: ", req.params.group_id)

  db.client.connect(function (err) {
    let query = 'DELETE FROM appointments where group_id=$1'
    let values = [req.params.group_id]
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to delete the appointment
        if (resultFirst) {
          console.log("delete query was successful", resultFirst)
          helper.querySuccess(res, req.params.group_id, 'Successfully deleted appointment')
        }
        else {
          helper.queryError(res, "Could not retrieve appointments!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
};

module.exports = {
  getAppointmentsForDisplay: getAppointmentsForDisplay,
  deleteAppointment: deleteAppointment
};