import { combineReducers } from 'redux'
import bloomApp from './alerts'
import userReducer from './user'

export default combineReducers({
  userReducer,
  bloomApp
});
