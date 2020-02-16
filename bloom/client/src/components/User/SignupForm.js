import React from 'react';
import './LoginForm.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLockOpen, FaLock } from 'react-icons/fa';


class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {street: '',
    //               city: '',
    //               state: '',
    //               zip: '',
    //               arrive: 0};
    // this.autocomplete = null
    //
    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   if (event.target.name) {
  //     this.setState({[event.target.name]: event.target.value})
  //   }
  //   else{
  //     this.setState({arrive: event.target.value});
  //   }
  // }

  handleSubmit() {
      alert("Submit");
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
                          <FaLockOpen/>
                      </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type="password" placeholder="Password"/>
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

              <Button className="" type="submit" variant="primary" onClick={this.handleSubmit}>Search</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignupForm;
