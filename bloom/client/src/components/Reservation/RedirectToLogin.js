import React from 'react';
import './BookingPage.css';
import LoginForm from '../User/LoginForm';
import SignupForm from '../User/SignupForm';
import { Row, Col } from 'react-bootstrap';

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
    console.log("called", newValue)
    this.setState({
      displayLogin: newValue
    })
  }

  render() {
    const RenderLoginOrSignup = (props) => {
      console.log("rerendering")
      console.log("login is: ", this.state.displayLogin)
      if(this.state.displayLogin) {
        return <LoginForm appointments={this.props.appointments} store_id={this.props.store_id} history={this.props.history} title="Login to continue." toggleLogin={this.toggleLogin}/>
      } else {
        console.log("render sign up!")
        return <Row className="justify-content-center">
          <Col xs={12}>
            <SignupForm appointments={this.props.appointments} store_id={this.props.store_id} history={this.props.history} toggleLogin={this.toggleLogin}/>
          </Col></Row>
      }
    }

    return (
      <RenderLoginOrSignup/>
    );
  }
}

export default RedirectToLogin;