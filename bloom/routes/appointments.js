const helper = require('../helper.js')
const db = require('../db.js');
const auth = require('../auth.js');

async function getAppointmentsForUser(req, res) {
  console.log("about to get appointments for user")
  console.log("user_id is: ", req.params.user_id)

  db.client.connect(function (err) {
    let query = 'SELECT store_id, date, start_time, end_time, price, group_id, service_id FROM appointments WHERE user_id=$1 ORDER BY group_id DESC'
    let values = [req.params.user_id]
    console.log("values is: ", values)
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the appointments
        if (resultFirst && resultFirst.rows.length > 0) {
          console.log("first query was successful")
          console.log(resultFirst.rows)
          
          let stores = []
          let dates =[]
          let start_times = []
          let end_times = []
          let costs = []
          let group_ids = []
          let service_ids = []
          let curr_group_services = []
          let grouped_service_ids = []
          let i = 1
          let group_id = resultFirst.rows[0].group_id
          let earliest_start_time = resultFirst.rows[0].start_time
          let latest_end_time = resultFirst.rows[0].end_time
          let cost = resultFirst.rows[0].price
          curr_group_services.push(resultFirst.rows[0].service_id)
          service_ids.push(resultFirst.rows[0].service_id)
          while(i < resultFirst.rows.length) {
            if(resultFirst.rows[i].group_id != group_id) {
              stores.push(resultFirst.rows[i-1].store_id)
              dates.push(resultFirst.rows[i-1].date)
              group_ids.push(group_id)
              start_times.push(earliest_start_time)
              end_times.push(latest_end_time)
              costs.push(cost)
              grouped_service_ids.push(curr_group_services)
              curr_group_services = [] 
              group_id = resultFirst.rows[i].group_id
              earliest_start_time = resultFirst.rows[i].start_time
              latest_end_time = resultFirst.rows[i].end_time
              cost = resultFirst.rows[i].price
            } else {
              if(resultFirst.rows[i].start_time < earliest_start_time) {
                earliest_start_time = resultFirst.rows[i].start_time
              }
              if(resultFirst.rows[i].end_time > latest_end_time) {
                latest_end_time = resultFirst.rows[i].end_time
              }
              cost += resultFirst.rows[i].price
            }
            curr_group_services.push(resultFirst.rows[i].service_id)
            service_ids.push(resultFirst.rows[i].service_id)
            i += 1
          }
          stores.push(resultFirst.rows[i-1].store_id)
          dates.push(resultFirst.rows[i-1].date)
          start_times.push(earliest_start_time)
          end_times.push(latest_end_time)
          costs.push(cost)
          group_ids.push(group_id)
          grouped_service_ids.push(curr_group_services)

          console.log("stores are: ", stores)
          console.log("dates are: ", dates)
          console.log("start times are: ", start_times)
          console.log("end_times are: ", end_times)
          console.log("costs are: ", costs)
          console.log("group_ids are: ", group_ids)
          console.log("service_ids are: ", service_ids)
          getServiceMappings(res, service_ids, (service_name_mappings) => {
            console.log("service mappings are: ", service_name_mappings)
            getStoreNameMappings(res, stores, (store_name_mappings) => {
              let response = {
                store_name_mappings: store_name_mappings,
                store_ids: stores,
                dates: dates,
                start_times: start_times, 
                end_times: end_times,
                costs: costs,
                group_ids: group_ids,
                service_name_mappings: service_name_mappings,
                grouped_service_ids: grouped_service_ids
              }
              console.log("everything sucessful, sending: ", response)
              helper.querySuccess(res, response, 'Successfully got appointment display info!');
            })
          })
        }
        else if(resultFirst) {
          helper.querySuccess(res, {}, 'No appointments exist for user!');
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
}

async function getServiceMappings(res, service_ids, callback) {
  console.log("about to get service mappings")
  
  db.client.connect(function (err) {
    var params = [];
    for(var i = 1; i <= service_ids.length; i++) {
      params.push('$' + i);
    }
    //get the service mappings for our appointment
    query = 'SELECT id, name FROM services WHERE id IN (' + params.join(',') + ')'
    values = service_ids
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the service mappings
        if (resultFirst) {
          console.log("got results: ", resultFirst)
          callback(resultFirst.rows)
        }
        else {
          helper.queryError(res, "Could not retrieve service mappings!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
}

function getStoreNameMappings(res, stores, callback) {
  console.log("about to get store name mappings")
  
  db.client.connect(function (err) {
    //get the store name mappings
    var params = [];
    for(var i = 1; i <= stores.length; i++) {
      params.push('$' + i);
    }
    query = 'SELECT id, name FROM stores WHERE id IN (' + params.join(',') + ')'
    values = stores
    db.client.query(query, values,
      async (errFirst, resultFirst) => {
        if (errFirst) {
          helper.queryError(res, errFirst);
        }
        // we were able to retrieve the store name
        if (resultFirst && resultFirst.rows.length > 0) {
          callback(resultFirst.rows)
        }
        else {
          helper.queryError(res, "Could not retrieve the store name mappings!");
        }
      }
    );

    if (err) {
      helper.dbConnError(res, err);
    }
  });
}

//REFACTOR BELOW IN THE FUTURE TO USE CALLBACKS. 
async function getAppointmentsForDisplay(req, res) {
  console.log("about to get appointment info")
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
  getAppointmentsForUser: getAppointmentsForUser,
  getAppointmentsForDisplay: getAppointmentsForDisplay,
  deleteAppointment: deleteAppointment
};