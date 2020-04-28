import { combineReducers } from 'redux'
import userReducer from './user'
import alertReducer from './alert'
// import serviceReducer from './service'
// import workerReducer from './worker'
import storeReducer from './stores'

let rootReducer = combineReducers({
  userReducer,
  alertReducer,
  storeReducer
  // serviceReducer,
  // workerReducer
})

export default rootReducer;
