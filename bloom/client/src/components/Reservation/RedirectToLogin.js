import React from 'react';
import './BookingPage.css';
import LoginForm from '../User/LoginForm';
import SignupForm from '../User/SignupForm';

class RedirectToLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayLogin: true
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.triggerSignInRedirect = this.triggerSignInRedirect.bind(this);
  }

  // redirect to the login page and pass the appointment data
  triggerSignInRedirect() {
    this.props.history.push({
      pathname: '/login',
      state: {
        appointments: this.props.appointments
      }
    })
  }

  // redirect to the login page and pass the appointment data
  triggerSignUpRedirect() {
    this.props.history.push({
      pathname: '/signup',
      state: {
        appointments: this.props.appointments
      }
    })
  }

  toggleLogin(newValue) {
    this.setState({
      displayLogin: newValue
    })
  }

  render() {
    const RenderLoginOrSignup = (props) => {
      if(this.state.displayLogin) {
        return <LoginForm appointments={this.props.appointments} store_id={this.props.store_id} history={this.props.history} title="Login to continue." toggleLogin={this.toggleLogin}/>
      } else {
        return <SignupForm appointments={this.props.appointments} store_id={this.props.store_id} history={this.props.history} toggleLogin={this.toggleLogin}/>
      }
    }

    return (
      <RenderLoginOrSignup/>
    );
  }
}

export default RedirectToLogin;