import React from 'react';
import './LoginForm.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLockOpen, FaLock, FaUser, FaPhone } from 'react-icons/fa';


class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {first_name: '',
                  last_name: '',
                  email: '',
                  role: false,
                  phone: '',
                  password: 0};
    // this.autocomplete = null
    //
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.type === "checkbox") {
      this.setState({[event.target.id]: !this.state[event.target.id]})
    }
    else{
      this.setState({[event.target.id]: parseInt(event.target.value) || event.target.value});
    }
  }

  handleSubmit(event) {
    // event.preventDefault();
    // console.log(JSON.stringify(this.state))
    // console.log(event)
    fetch('http://localhost:8081/signUp' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(function(response){
      if(response.status!==200){
        console.log("Error!", response.status)
        throw new Error(response.status)
      }
      else{
        // redirect to home page signed in
        console.log("Successful login!")
      }
    })
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Form className="formBody rounded">
              <h3>Sign Up</h3>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaUser/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="text" placeholder="First Name" id="first_name" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaUser/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="text" placeholder="Last Name" id="last_name" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaPhone/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="text" placeholder="Phone Number" id="phone" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaEnvelope/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="email" placeholder="Email" id="email" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaLockOpen/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="password" placeholder="Password" id="password" onChange={this.handleChange}/>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                      <InputGroup.Text>
                          <FaLock/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="password" placeholder="Confirm Password"/>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="service">
                <Form.Check 
                  id="role"
                  label="Salon Owner"
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Button className="" type="submit" variant="primary" onClick={this.handleSubmit}>Search</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignupForm;
