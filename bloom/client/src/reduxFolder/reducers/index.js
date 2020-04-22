import { combineReducers } from 'redux'
import userReducer from './user'
import alertReducer from './alert'
// import serviceReducer from './service'
// import workerReducer from './worker'

let rootReducer = combineReducers({
  userReducer,
  alertReducer,
  // serviceReducer,
  // workerReducer
})

export default rootReducer;