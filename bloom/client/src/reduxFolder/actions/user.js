

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE'


export function userLoginSuccess(email, auth_token) {

  return {
    type: USER_LOGIN_SUCCESS,
    user: {
      email: email,
      auth_token: auth_token,
    }
  }
}


export function userLoginFailure(error) {

  return {
    type: USER_LOGIN_FAILURE,
    error: error
  }
}
