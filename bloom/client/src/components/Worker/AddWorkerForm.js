import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaEnvelope } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';

class AddWorkerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: 0, label: 'Brazilian Blowout' },
        { value: 1, label: 'Manicure' },
      ]
    };
    this.emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      email: Yup.string()
      .email("Must be a valid email address")
      .max(100, "Email must be less than 100 characters")
      .required("Email is required"),
    });

    this.triggerWorkerDisplay = this.triggerWorkerDisplay.bind(this);
  }

  // redirect to the worker display page and pass the new worker data
  triggerWorkerDisplay(returnedWorker) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + returnedWorker.id,
      state: {
        worker: returnedWorker
      }
    })
  }
    
  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik 
              initialValues={{
                email: '',
                services: ''
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                let store_id = this.props.match.params.store_id
                let triggerWorkerDisplay = this.triggerWorkerDisplay
                
                values.services = values.services.map(function(val){ 
                  return val.value; 
                })

                fetch('http://localhost:8081/stores/addWorker/' + store_id, {
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
                    return response.json();
                  }
                })
                .then(function(data){
                  // redirect to home page signed in
                  if(data){
                    triggerWorkerDisplay(data)
                  }
                })
              }}
            >
            {( {values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue}) => (
              <Form className="formBody rounded">
                <h3>Add Worker</h3>

                <Form.Group controlId="formEmail">
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

                <Form.Group controlId="formServices">
                  <Select
                    value={values.services}
                    onChange={option => setFieldValue("services", option)}
                    name="services"
                    options={this.state.options}
                    isMulti={true}
                    placeholder={"Services"}
                    className={touched.services && errors.services ? "error" : null}
                  />
                  {touched.services && errors.services ? (
                    <div className="error-message">{errors.services}</div>
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

export default AddWorkerForm;
