import React from 'react';
import '../../App.css';
import './LoginForm.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope, FaLockOpen, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { Formik } from 'formik';
import paint from '../../assets/abstract-painting.jpg';
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {signup} from '../../reduxFolder/redux.js'

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    // RegEx for phone number validation
    this.phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
    this.emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      first_name: Yup.string()
      .min(2, "First name must have at least 2 characters")
      .max(100, "First name can't be longer than 100 characters")
      .required("First name is required"),
      last_name: Yup.string()
      .min(2, "Last name must have at least 2 characters")
      .max(100, "Last name can't be longer than 100 characters")
      .required("Last name is required"),
      email: Yup.string()
      .email("Must be a valid email address")
      .max(100, "Email must be less than 100 characters")
      .required("Email is required"),
      phone: Yup.string()
      .matches(this.phoneRegExp, "Phone number is not valid"),
      password: Yup.string()
      .min(6, "Password must have at least 6 characters")
      .max(100, "Password can't be longer than 100 characters")
      .required("Password required"),
      password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required("Password Confirmation required")
    });
  }

  render() {
    return (
      <Container fluid>
      <img src={paint} alt="paint" style={{top: 0, left: 0, position: 'absolute', height: '100%', width:'100%', filter: 'grayscale(0.4)'}}/>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik
              initialValues={{
                first_name: '',
                last_name: '',
                email: '',
                role: '0',
                phone: '',
                password: '',
                password_confirmation: ''
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                this.props.signUpUser(values)
              }}
            >
            {( {values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit}) => (
              <Form className="formBody rounded" style={{marginTop: 120}}>
                <h3 style={{marginBottom: 40}}>Sign Up</h3>

                <Form.Group controlId="formFirstName" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaUser/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      placeholder="First Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.first_name && errors.first_name ? "error" : null}/>
                  </InputGroup>
                  {touched.first_name && errors.first_name ? (
                    <div className="error-message">{errors.first_name}</div>
                  ): null}
                </Form.Group>


                <Form.Group controlId="formLastName" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaUser/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text"
                    value={values.last_name}
                    placeholder="Last Name"
                    name="last_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.last_name && errors.last_name ? "error" : null}/>
                  </InputGroup>
                  {touched.last_name && errors.last_name ? (
                    <div className="error-message">{errors.last_name}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formPhone" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaPhone/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text"
                      value={values.phone}
                      placeholder="Phone Number"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.phone && errors.phone ? "error" : null}/>
                  </InputGroup>
                  {touched.phone && errors.phone ? (
                    <div className="error-message">{errors.phone}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formEmail" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaEnvelope/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="email"
                      value={values.email}
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.email && errors.email ? "error" : null}/>
                  </InputGroup>
                  {touched.email && errors.email ? (
                    <div className="error-message">{errors.email}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formPassword" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaLockOpen/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="password"
                      value={values.password}
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.password && errors.password ? "error" : null}/>
                  </InputGroup>
                  {touched.password && errors.password ? (
                    <div className="error-message">{errors.password}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formPasswordConfirmation" className="form">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaLock/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="password"
                      value={values.password_confirmation}
                      placeholder="Confirm Password"
                      name="password_confirmation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.password_confirmation && errors.password_confirmation ? "error" : null}/>
                  </InputGroup>
                  {touched.password_confirmation && errors.password_confirmation ? (
                    <div className="error-message">{errors.password_confirmation}</div>
                  ): null}
                </Form.Group>
                <Button className="signup" onClick={handleSubmit}>Sign Up</Button>
                <p> Already have a Bloom account? <Link to="/login" style={{color: 'black'}}><b> Login. </b></Link></p>
              </Form>
            )}
            </Formik>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  signUpUser: (values) => signup(values)
}, dispatch)


export default connect(null, mapDispatchToProps)(SignupForm);
