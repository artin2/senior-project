export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'
export const USER_LOGOUT = 'USER_LOGOUT'
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS'


export function userLoginSuccess(userPassed) {
  return {
    type: USER_LOGIN_SUCCESS,
    user: userPassed
  }
}

export function userLoginFailure(error) {
  return {
    type: USER_LOGIN_FAILURE,
    error: error
  }
}

export function editUserSuccess(userPassed) {
  return {
    type: EDIT_USER_SUCCESS,
    user: userPassed
  }
}

export function userLogout() {
  return {
    type: USER_LOGOUT
  }
}

