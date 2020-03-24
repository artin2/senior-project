import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaLockOpen, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class EditProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
        password_confirmation: '',
        id: ''
      }
    }
    // RegEx for phone number validation
    this.phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
    // this.emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
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
      // email: Yup.string()
      // .email("Must be a valid email address")
      // .max(100, "Email must be less than 100 characters")
      // .required("Email is required"),
      phone: Yup.string()
      .matches(this.phoneRegExp, "Phone number is not valid"),
      password: Yup.string()
      .min(6, "Password must have at least 6 characters")
      .max(100, "Password can't be longer than 100 characters")
      .required("Password is required"),
      password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required("Password confirmation is required"),
    });

    this.triggerUserDisplay = this.triggerUserDisplay.bind(this);
  }

  // redirect to the store display page and pass the new store data
  triggerUserDisplay(returnedUser) {
    this.props.history.push({
      pathname: '/users/' + returnedUser.id,
      // state: {
      //   user: returnedUser
      // }
    })
  }

  componentDidMount() {
    this.setState({ 
      user: JSON.parse(Cookies.get('user').substring(2))
    });
  }
    
  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik
              enableReinitialize
              initialValues={{
                first_name: this.state.user.first_name,
                last_name: this.state.user.last_name,
                phone: this.state.user.phone,
                password: '',
                password_confirmation: '',
                id: 0
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                let user_id = this.props.match.params.user_id
                let triggerUserDisplay = this.triggerUserDisplay

                values.id = this.props.match.params.user_id
                fetch('http://localhost:8081/users/' + user_id , {
                  method: "POST",
                  headers: {
                    'Content-type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(values)
                })
                .then(function(response){
                  if(response.status!==200){
                    store.dispatch(addAlert(response))
                  }
                  else{
                    // redirect to home page signed in
                    return response.json()
                  }
                })
                .then(data => {
                  if(data){
                    triggerUserDisplay(data)
                  }
                });
              }}
            >
            {( {values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit}) => (
              <Form className="formBody rounded">
                <h3>Edit Profile</h3>

                <Form.Group controlId="formFirstName">
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

                <Form.Group controlId="formLastName">
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

                <Form.Group controlId="formPhone">
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

                <Form.Group controlId="formPassword">
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

                <Form.Group controlId="formPasswordConfirmation">
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
                <Button onClick={handleSubmit}>Submit</Button>
              </Form>
            )}
            </Formik>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default EditProfileForm;
