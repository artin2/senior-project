import React from 'react';
import './LoginForm.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLock } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useGoogleLogin } from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {TiSocialFacebookCircular, TiSocialGooglePlus} from 'react-icons/ti';

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
    // this.state = {email: '',
    //               password: ''};
    // this.autocomplete = null
    //
    //
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit() {
      alert("Submit");
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
                  <Form.Control type="email" placeholder="Email"/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaLock/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="password" placeholder="Password"/>


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
              <Button  className="" type="submit" variant="primary" onClick={this.handleSubmit}>Submit</Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm;
