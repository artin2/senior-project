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
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
import { getPictures, deleteHandler, uploadHandler } from '../s3'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

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
      selectedOption: null,
      pictures: [],
      keys: [],
      selectedFiles: []
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
      .nullable(),
      pictureCount: Yup.number()
      .required("Pictures are required")
      .min(1, "Must have at least one picture")
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

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.service !== this.state.service) {
      let picturesFetched = await getPictures('stores/' + this.state.service.store_id + '/services/' + this.state.service.name + '/')
      this.setState({
        pictures: picturesFetched
      })
    }

    // can put this for now so we don't have to upload to s3
    // this.setState({
      // pictures: [
      //   { 
      //     url: "/hair.jpg",
      //     key: "/hair.jpg"
      //   },
      //   {
      //     url: "/nails.jpg",
      //     key: "/nails.jpg"
      //   },
      //   {
      //     url: "/salon.jpg",
      //     key: "/salon.jpg"
      //   }
      // ]
    // })
  }

  deleteFileChangeHandler = async (event, setFieldValue, newPictureLength) => {
    if(event.target.checked){
      await this.state.keys.push(event.target.id)
      console.log(this.state.pictures.length, newPictureLength, this.state.keys.length)
      setFieldValue('pictureCount', this.state.pictures.length + newPictureLength - this.state.keys.length)
    }
    else{
      await this.state.keys.pop(event.target.id)
      console.log(this.state.pictures.length, newPictureLength, this.state.keys.length)
      setFieldValue('pictureCount', this.state.pictures.length + newPictureLength - this.state.keys.length)
    }
  }

  fileChangedHandler = (event, setFieldValue, pictures) => {
    this.setState({ selectedFiles: event.target.files })
    setFieldValue('pictureCount', this.state.pictures.length + event.target.files.length - this.state.keys.length)
    setFieldValue('pictures', event.target.files)
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.service){
      // console.log(this.props.location.state.service)
      let convertedCategoryData = this.props.location.state.service.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      // console.log(convertedCategoryData)
      this.setState({
        service: this.props.location.state.service,
        convertedCategory: convertedCategoryData
      })
    }
    else{
      // first we fetch the service itself
      fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id, {
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
          let convertedCategoryData = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
          this.setState({
            service: data,
            convertedCategory: convertedCategoryData
          })
        }
      });



      // // then we get the worker data to display for user
      // // need to get store category, fetch?
      // // refactor later to make it a get request
      // // maybe have to refactor the whole table to keep track of names...?
      // fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + "/workers" , {
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
                pictures: [],
                pictureCount: this.state.pictures.length - this.state.keys.length,
                workers: this.state.service.workers,
                category: this.state.convertedCategory,
                store_id: this.props.match.params.store_id
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={async (values) => {
                let store_id = this.props.match.params.store_id
                let service_id = this.props.match.params.service_id
                let triggerServiceDisplay = this.triggerServiceDisplay

                values.category = values.category.map(function(val){ 
                  return val.label; 
                })

                // remove files from s3
                // await deleteHandler(this.state.keys)

                // upload new images to s3 from client to avoid burdening back end
                // let prefix = 'stores/' + this.props.match.params.store_id + '/services/' + values.name + '/'
                // await uploadHandler(prefix, this.state.selectedFiles)

                // need to figure out this...
                // values.workers = values.workers.map(function(val){ 
                //   return val.value; 
                // })

                fetch(fetchDomain + '/stores/' + store_id + "/services/" + service_id, {
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
                    triggerServiceDisplay()
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

                <Form.Group controlId="pictureCount">
                  <Form.Label>Delete Images</Form.Label>
                  {this.state.pictures.map((picture, index) => (
                    <div key={"pic-" + index}>
                      <img className="img-fluid" src={picture.url} alt={"Slide " + index} />
                      <Form.Check
                        // style={{marginLeft: 30}}
                        id={picture.key}
                        label={picture.key.split('/').slice(-1)[0]}
                        onChange={event => this.deleteFileChangeHandler(event, setFieldValue, values.pictures.length)}
                      />
                    </div>
                  ))}
                </Form.Group>

                <Form.Group controlId="pictures">
                  <Form.Label>Add Images</Form.Label>
                  <br/>
                  <input 
                    onChange={event => this.fileChangedHandler(event, setFieldValue, values.pictures)}
                    type="file"
                    multiple
                    className={touched.pictures && errors.pictures ? "error" : null}
                  />
                  {touched.pictureCount && errors.pictureCount ? (
                    <div className="error-message">{errors.pictureCount}</div>
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
