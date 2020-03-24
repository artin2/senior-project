import { ADD_ALERT, ADD_USER } from "../actions/index"

const initialState = {
  alert: {},
  update: false
}

function bloomApp(state = initialState, action) {
  switch (action.type) {
    case ADD_ALERT:
      return Object.assign({}, state, {
        alert: action.message
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