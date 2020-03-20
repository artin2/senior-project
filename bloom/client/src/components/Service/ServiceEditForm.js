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
class ServiceEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: {
        id: "",
        name: "",
        cost: "",
        workers: [],
        store_id: "",
        category: "",
        description: ""
      },
      categoryOptions: [
        { value: 'nails', label: 'Nails' },
        { value: 'hair', label: 'Hair' }
      ],
      convertedCategory: [],
      workerOptions: [],
      selectedOption: null
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
    });

    this.triggerServiceDisplay = this.triggerServiceDisplay.bind(this);
  }

  // redirect to the service display page and pass the new store data
  triggerServiceDisplay(returnedService) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id,
      state: {
        service: returnedService
      }
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.service){
      let convertedCategoryData = this.props.location.state.service.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      this.setState({
        service: this.props.location.state.service,
        convertedCategory: convertedCategoryData
      })
    }
    else{
      // first we fetch the service itself
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id, {
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
        console.log("Retrieve service data successfully!", data)
        let convertedCategoryData = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
        this.setState({
          service: data,
          convertedCategory: convertedCategoryData
        })
      });

      // // then we get the worker data to display for user
      // // need to get store category, fetch?
      // // refactor later to make it a get request
      // // maybe have to refactor the whole table to keep track of names...?
      // fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + "/workers" , {
      //   method: "POST",
      //   headers: {
      //       'Content-type': 'application/json'
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify(values)
      // })
      // .then(function(response){
      //   console.log(response)
      //   if(response.status!==200){
      //     // should throw an error here
      //     console.log("Error!", response.status)
      //     // throw new Error(response.status)
      //     // window.location.href='/'
      //   }
      //   else{
      //     return response.json();
      //   }
      // })
      // .then(data => {
      //   console.log("Limited store data from server:", data)
      //   let convertedWorkers = data.map((worker) => ({ value: worker.id, label: worker.first_name + " " + worker.last_name }));
      //   this.setState({
      //     workerOptions: convertedWorkers
      //   })
      // });
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
                name: this.state.service.name,
                cost: this.state.service.cost,
                duration: this.state.service.duration,
                description: this.state.service.description,
                pictures: this.state.service.pictures,
                workers: this.state.service.workers,
                category: this.state.service.category,
                store_id: this.props.match.params.store_id
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                let store_id = this.props.match.params.store_id
                let service_id = this.props.match.params.service_id
                let triggerServiceDisplay = this.triggerServiceDisplay

                values.category = values.category.map(function(val){ 
                  return val.label; 
                })

                // need to figure out this...
                // values.workers = values.workers.map(function(val){ 
                //   return val.value; 
                // })

                fetch('http://localhost:8081/stores/' + store_id + "/services/" + service_id, {
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
                  triggerServiceDisplay()
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
                <h3>Edit Service</h3>

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

                {/* <Form.Group controlId="formWorkers">
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
                </Form.Group> */}

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

export default ServiceEditForm;
