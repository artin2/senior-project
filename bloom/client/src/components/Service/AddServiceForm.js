import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaDollarSign, FaHandshake, FaHourglassHalf } from 'react-icons/fa';
import { Formik } from 'formik';
import Select from 'react-select';
// import * as Yup from 'yup';

class AddServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {
        pictures: [],
        name: "",
        description: "",
        phone: "",
        id: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        category: []
      },
      categoryOptions: [
        { value: 'nails', label: 'Nails' },
        { value: 'hair', label: 'Hair' }
      ],
      workerOptions: [],
      selectedOption: null
    };

    this.triggerStoreDisplay = this.triggerStoreDisplay.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + "/workers" , {
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
      console.log("Limited store data from server:", data)
      let convertedWorkers = data.map((worker) => ({ value: worker.id, label: worker.first_name + " " + worker.last_name }));
      this.setState({
        workerOptions: convertedWorkers
      })
    });
  }

  // redirect to the worker display page and pass the new worker data
  triggerStoreDisplay() {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id
    })
  }
    
  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik
              enableReinitialize
              initialValues={{
                service: '',
                cost: '',
                duration: '',
                workers: [],
                category: []
              }}
              onSubmit={(values) => {
                let store_id = this.props.match.params.store_id
                let triggerStoreDisplay = this.triggerStoreDisplay

                fetch('http://localhost:8081/stores/addService/' + store_id, {
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
                    console.log("Successfully added service!", response.status)
                    return response.json();
                  }
                })
                .then(function(data){
                  // redirect to home page signed in
                  console.log("Service data returned:", data)
                  triggerStoreDisplay()
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
                <h3>Add Service</h3>

                <Form.Group controlId="formService">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaHandshake/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" 
                      value={values.service} 
                      placeholder="Name of Service" 
                      name="service" 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={touched.service && errors.service ? "error" : null}/>
                  </InputGroup>
                  {touched.service && errors.service ? (
                    <div className="error-message">{errors.service}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formCost">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaDollarSign/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="text" 
                    value={values.cost}
                    placeholder="Cost" 
                    name="cost" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.cost && errors.cost ? "error" : null}/>
                  </InputGroup>
                  {touched.cost && errors.cost ? (
                    <div className="error-message">{errors.cost}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formDuration">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaHourglassHalf/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                      type="text"
                      value={values.duration}
                      placeholder="Duration (in min)" 
                      name="duration" 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={touched.duration && errors.duration ? "error" : null}/>
                  </InputGroup>
                  {touched.duration && errors.duration ? (
                    <div className="error-message">{errors.duration}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formWorkers">
                  <Select
                    value={values.workers}
                    onChange={option => setFieldValue("workers", option)}
                    name="workers"
                    options={this.state.workerOptions}
                    isMulti={true}
                    placeholder={"Assigned Workers"}
                    className={touched.workers && errors.workers ? "error" : null}
                  />
                  {touched.workers && errors.workers ? (
                    <div className="error-message">{errors.workers}</div>
                  ): null}
                </Form.Group>

                <Form.Group controlId="formCategory">
                  <Select
                    value={values.category}
                    onChange={option => setFieldValue("category", option)}
                    name="category"
                    options={this.state.categoryOptions}
                    isMulti={true}
                    placeholder={"Category"}
                    className={touched.category && errors.category ? "error" : null}
                  />
                  {touched.category && errors.category ? (
                    <div className="error-message">{errors.category}</div>
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

export default AddServiceForm;
