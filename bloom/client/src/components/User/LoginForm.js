import React from 'react';
import './LoginForm.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLock } from 'react-icons/fa';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import {TiSocialFacebookCircular, TiSocialGooglePlus} from 'react-icons/ti';
// import ReactDOM from 'react-dom';
// import { useGoogleLogin } from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import { useHistory } from 'react-router'


const successGoogle = (response) => {
  console.log("Google Success: ", response.accessToken);
}

const failureGoogle = (response) => {
  console.log("Google Failure:", response.error);
}

const successFacebook = (response) => {
  console.log("Facebook Success:", response.accessToken);
}

const failureFacebook = (response) => {
  if(response.status){
    console.log("Facebook Failure");
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '',
                  password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    //there might be a CORS issue with the backend, this doesn't work without preventDefault..
    event.preventDefault();
    fetch('http://localhost:8081/login' , {
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Cache': 'no-cache'
      },
      credentials: 'include',
      method: "POST",
      body: JSON.stringify(this.state)
    })
    .then(function(response){

      if(response.status!==200){
        console.log("Error!", response.status)
        const error = new Error(response.error);
        throw error;
      }
      else{
        // redirect to home page signed in
        console.log("Successful login!")
        window.location.href='/'
      }
    }).catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Form className="formBody rounded">
              <h3>Login</h3>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaEnvelope/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control id="email" type="email" placeholder="Email" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaLock/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control id="password" type="password" placeholder="Password" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>
              <Col xs={8} sm={10} md={11} lg={12}>
                <Row className="justify-content-center">
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_ID}
                    buttonText="Login with Google"
                    onSuccess={successGoogle}
                    onFailure={failureGoogle}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                      <button onClick={renderProps.onClick} style={{margin: '10px', marginLeft: '20px', width: '220px', backgroundColor:"#db4a39", color: 'white', paddingRight: '30px',
                    marginBottom: '50px', height: '48px', fontSize: '14px'}}> <TiSocialGooglePlus  size={45} style={{paddingRight:"15px"}}/>Login with Google</button>
                    )}
                  />

                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_ID} //APP ID NOT CREATED YET
                    fields="name,email,picture"
                    onFailure={failureFacebook}
                    xfbml={true}
                    cssClass="facebookButton"
                    icon={<TiSocialFacebookCircular size={45} style={{paddingRight:"15px"}}/>}
                    callback={successFacebook}
                    />
                </Row>
                <Button  className="" type="submit" variant="primary" onClick={this.handleSubmit}>Login</Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm;
