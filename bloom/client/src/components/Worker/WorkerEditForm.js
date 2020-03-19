import React from 'react';
import '../../App.css';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';


class WorkerEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      worker: {
        id: 0,
        store_id: 0,
        services: [],
        user_id: 0,
        created_at: "",
        first_name: [],
        last_name: ""
      }
    };

    this.options = [
      { value: 0, label: 'Brazilian Blowout' },
      { value: 1, label: 'Manicure' },
    ];

    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      services: Yup.string()
      .required("Service is required")
      // .nullable()
    });
  }

  componentDidMount() {
    fetch('http://localhost:8081/stores/' + this.props.location.state.store_id + '/workers/' + this.props.location.state.worker_id, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
      console.log(response)
      if(response.status!==200){
        // should throw an error here
        console.log("Error!", response.status)
        // throw new Error(response.status)
        // window.location.href='/'
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      console.log("Retrieve worker data successfully!", data)
      this.setState({
        worker: data
      })
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
                services: null
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                values.services = values.services.map(function(val){ 
                  return val.value; 
                })
                let store_id = this.props.location.state.store_id
                let worker_id = this.props.location.state.worker_id
                fetch('http://localhost:8081/stores/' + store_id + '/workers/' + worker_id, {
                  method: "POST",
                  headers: {
                    'Content-type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(values)
                })
                .then(function(response){
                  if(response.status!==200){
                    console.log("Error!", response.status)
                    // throw new Error(response.status)
                  }
                  else{
                    // redirect to worker page
                    console.log("Successful update of worker!", response.status)
                    // window.location.href='/stores/' + store_id + '/workers/' + worker_id
                    // redirect not working, need to send store id and worker id to component
                    // this is a general problem that we need to fix...
                    // maybe set a bunch of cookies instead?
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
                <h3>Worker Edit</h3>
                
                <Form.Group controlId="formServices">
                  <Select
                    value={values.services}
                    onChange={option => setFieldValue("services", option)}
                    name="services"
                    options={this.options}
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

export default WorkerEditForm;
