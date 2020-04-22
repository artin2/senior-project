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
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';


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
        first_name: "",
        last_name: ""
      },
      options: [
        { value: 0, label: 'Brazilian Blowout' },
        { value: 1, label: 'Manicure' },
      ],
      serviceMapping: {
        0: "Brazilian Blowout",
        1: "Manicure"
      }
    };

    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      services: Yup.string()
      .required("Service is required")
      // .nullable()
    });

    this.triggerWorkerDisplay = this.triggerWorkerDisplay.bind(this);
  }

  // redirect to the store display page and pass the new store data
  triggerWorkerDisplay(returnedWorker) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + this.props.match.params.worker_id,
      state: {
        worker: returnedWorker
      }
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.worker){
      let convertedServices = this.props.location.state.worker.services.map((service) => ({ value: service, label: this.state.serviceMapping[service] }));
      this.setState({
        worker: this.props.location.state.worker,
        selectedOption: convertedServices
      })
    }
    else{
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/workers/' + this.props.match.params.worker_id, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        if(response.status!==200){
          // throw an error alert
          store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          let convertedServices = data.services.map((service) => ({ value: service, label: this.state.serviceMapping[service] }));
          this.setState({
            worker: data,
            selectedOption: convertedServices
          })
        }
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
          <Formik 
              enableReinitialize
              initialValues={{
                services: this.state.selectedOption,
                id: this.state.worker.id,
                store_id: this.state.worker.store_id,
                user_id: this.state.worker.user_id,
                created_at: this.state.worker.created_at,
                first_name: this.state.worker.first_name,
                last_name: this.state.worker.last_name
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                values.services = values.services.map(function(val){ 
                  return val.value; 
                })
                
                let store_id = this.props.match.params.store_id
                let worker_id = this.props.match.params.worker_id
                let triggerWorkerDisplay = this.triggerWorkerDisplay;

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
                    store.dispatch(addAlert(response))
                  }
                  else{
                    // redirect to worker page
                    return response.json()
                  }
                })
                .then(data => {
                  if(data){
                    triggerWorkerDisplay()
                  }
                });
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

export default WorkerEditForm;
