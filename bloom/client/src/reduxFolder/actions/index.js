// // let message = {}
// // export const addAlert = messagePassed => ({
// //   type: 'ADD_ALERT',
// //   status: messagePassed,status,
// //   text: messagePassed.statusText
// // })

// // function addAlert(messagePassed) {
// //   return {
// //     type: 'ADD_ALERT',
// //     status: messagePassed,status,
// //     text: messagePassed.statusText
// //   }
// // }

// function addAlertWithDispatch(messagePassed) {
//   const action = {
//     type: ADD_ALERT,
//     status: messagePassed,status,
//     text: messagePassed.statusText
//   }
//   dispatch(action)
// }


/*
 * action types
 */

export const ADD_ALERT = 'ADD_ALERT'
export const REMOVE_ALERT = 'REMOVE_ALERT'
export const ADD_USER = 'ADD_USER'

/*
 * action creators
 */

export function addAlert(messagePassed) {
  return { 
    type: ADD_ALERT, 
    message: messagePassed
  }
}

export function removeAlert(test) {
  return { 
    type: REMOVE_ALERT,
    test: test
  }
}

export function addUser(userPassed) {
  return { 
    type: ADD_USER, 
    user: userPassed 
  }
}