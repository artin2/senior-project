import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaDollarSign, FaHandshake, FaHourglassHalf, FaPen } from 'react-icons/fa';
import { Formik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class AddServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cost: '',
      duration: '',
      description: '',
      pictures: [],
      workers: [],
      category: [],
      store_id: '',
      categoryOptions: [
        { value: 'nails', label: 'Nails' },
        { value: 'hair', label: 'Hair' }
      ],
      workerOptions: [],
      selectedOption: null,
      selectedFiles: null
    };

    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      name: Yup.string()
      .min(2, "Name must have at least 2 characters")
      .max(100, "Name can't be longer than 100 characters")
      .required("Name is required"),
      description: Yup.string()
      .min(20, "Description must have at least 20 characters")
      .required("Description is required"), // will make it required soon,
      cost: Yup.number()
      .positive("Cost must be positive")
      // .integer()
      .required("Cost is required"),
      duration: Yup.number()
      .positive("Duration must be positive")
      .integer("Duration must be an integer")
      .required("Duration is required"),
      workers: Yup.array()
      .required("Worker is required")
      .nullable(),
      category: Yup.array()
      .required("Category is required")
      .nullable()
      // pictures: Yup.array()
      // .required("Picture is required")
      // .nullable()
    });

    this.triggerStoreDisplay = this.triggerStoreDisplay.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
  }

  componentDidMount() {
    // need to get store category, fetch?
    fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + "/workers" , {
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
        let convertedWorkers = data.map((worker) => ({ value: worker.id, label: worker.first_name + " " + worker.last_name }));
        this.setState({
          workerOptions: convertedWorkers
        })
      }
    });
  }

  // redirect to the worker display page and pass the new worker data
  triggerStoreDisplay() {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id
    })
  }

  async uploadHandler() {
    // upload each image to s3
    // have to get presigned url from server before uploading directly
    for(let i = 0; i < this.state.selectedFiles.length; i++){
      let values = {
        fileName: 'stores/' + this.props.match.params.store_id + '/services/' + this.state.selectedFiles[i].name, // should add the current time so its unique key?
        fileType: this.state.selectedFiles[i].type
      }

      const response = await fetch('http://localhost:8081/getPresignedUrl/', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      const url = await response.json()

      const responseS3 = await fetch(url, {
          method: "PUT",
          headers: {
              'Content-type': this.state.selectedFiles[i].type
          },
          body: this.state.selectedFiles[i]
        })
      
      if(responseS3.status!==200){
        // throw an error alert
        store.dispatch(addAlert(response))
      }
    }
  }

  fileChangedHandler = event => {
    this.setState({ selectedFiles: event.target.files })
  }
    
  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik
              enableReinitialize
              initialValues={{
                name: '',
                cost: '',
                duration: '',
                description: '',
                pictures: [],
                workers: [],
                category: [],
                store_id: this.props.match.params.store_id
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={async (values, {setSubmitting }) => {
                let store_id = this.props.match.params.store_id
                let triggerStoreDisplay = this.triggerStoreDisplay

                values.category = values.category.map(function(val){ 
                  return val.label; 
                })

                values.workers = values.workers.map(function(val){ 
                  return val.value; 
                })

                // upload to s3 from client to avoid burdening back end
                // NOTE: returns the name of the files, not the url
                values.pictures = await this.uploadHandler()

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
                    store.dispatch(addAlert(response))
                  }
                  else{
                    return response.json();
                  }
                })
                .then(function(data){
                  // redirect to home page signed in
                  if(data){
                    triggerStoreDisplay()
                  }
                })

                setSubmitting(false)
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
                      value={values.name} 
                      placeholder="Name of Service" 
                      name="name" 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={touched.name && errors.name ? "error" : null}/>
                  </InputGroup>
                  {touched.name && errors.name ? (
                    <div className="error-message">{errors.name}</div>
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

                <Form.Group controlId="formDescription">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                          <FaPen/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                      type="textarea"
                      rows={3}
                      value={values.description}
                      placeholder="Description" 
                      name="description" 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={touched.description && errors.description ? "error" : null}/>
                  </InputGroup>
                  {touched.description && errors.description ? (
                    <div className="error-message">{errors.description}</div>
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

                <Form.Group controlId="formPictures">
                  <input 
                    onChange={this.fileChangedHandler}
                    type="file"
                    multiple
                    className={touched.pictures && errors.pictures ? "error" : null}
                  />
                  {touched.pictures && errors.pictures ? (
                    <div className="error-message">{errors.pictures}</div>
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