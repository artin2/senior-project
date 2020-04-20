import { USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE } from "../actions/user"

const initialState = {
  user: {},
  error: '',
}

function userReducer(state = initialState, action) {
  switch (action.type) {

    case USER_LOGIN_FAILURE:

      return Object.assign({}, state, {
        error: action.error
      })
    case USER_LOGIN_SUCCESS:

      return Object.assign({}, state, {
          user: action.user
        })

    default:
      return state
  }
}

export default userReducer;
