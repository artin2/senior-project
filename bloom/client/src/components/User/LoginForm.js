import React from 'react';
import './LoginForm.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLock } from 'react-icons/fa';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {email: '',
    //               password: ''};
    // this.autocomplete = null
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

              <Button className="" type="submit" variant="primary" onClick={this.handleSubmit}>Search</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm;
