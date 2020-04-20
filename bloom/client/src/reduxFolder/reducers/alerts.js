import { ADD_ALERT, REMOVE_ALERT, ADD_USER } from "../actions/index"

const initialState = {
  alert: {},
  user: {},
  update: false
}

function bloomApp(state = initialState, action) {
  switch (action.type) {
    case ADD_ALERT:
      return Object.assign({}, state, {
        alert: action.message
      })
    case REMOVE_ALERT:
      return Object.assign({}, state, {
        alert: {}
      })
    case ADD_USER:
      return Object.assign({}, state, {
        user: action.user
      })
    default:
      return state
  }
}

export default bloomApp