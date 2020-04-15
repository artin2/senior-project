import React from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaShoppingCart, FaRoad, FaBuilding, FaUniversity, FaGlobe, FaPen, FaPhone } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Cookies from 'js-cookie';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';
// import { uploadHandler } from '../s3';

class StoreSignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: null
    }
    
    // options for store categories
    this.options = [
      { value: 'nails', label: 'Nails' },
      { value: 'hair', label: 'Hair' },
      { value: 'makeup', label: 'Makeup' },
      { value: 'eyelashes', label: 'Eyelashes' },
      { value: 'eyelash extensions', label: 'Eyelash Extensions'},
      { value: 'eyebrows', label: 'Eyebrows'},
      { value: 'facials', label: 'Facials'},
      { value: 'skincare', label: 'Skin Care'},
      { value: 'waxing', label: 'Waxing'},
      { value: 'mens', label: 'Mens Services'}
    ];

    // RegEx for phone number validation
    this.phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
   
    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      name: Yup.string()
      .min(2, "Store name must have at least 2 characters")
      .max(100, "Store name can't be longer than 100 characters")
      .required("Name is required"),
      description: Yup.string()
      .min(20, "Description must have at least 20 characters")
      .required("Description is required"),
      phone: Yup.string()
      .matches(this.phoneRegExp, "Phone number is not valid")
      .required("Phone number is required"),
      street: Yup.string()
      .min(6, "Street must have at least 6 characters")
      .max(100, "Street can't be longer than 100 characters")
      .required("Street is required"),
      city: Yup.string()
      .min(2, "City must have at least 2 characters")
      .max(40, "City can't be longer than 40 characters")
      .required("City is required"),
      state: Yup.string()
      .min(2, "State must have at least 2 characters")
      .max(12, "State can't be longer than 12 characters")
      .required("State is required"),
      zipcode: Yup.string()
      .max(20, "Zipcode can't be longer than 100 characters")
      .required("Zipcode is required"),
      category: Yup.array()
      .required("Category is required")
      .nullable()
    });

    this.triggerStoreDisplay = this.triggerStoreDisplay.bind(this);
  }

  // redirect to the store display page and pass the new store data
  triggerStoreDisplay(returnedStore) {
    this.props.history.push({
      pathname: '/stores/' + returnedStore.id,
      state: {
        store: returnedStore
      }
    })
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
              initialValues={{
                name: '',
                description: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                zipcode: '',
                category: [],
                owner_id: ""
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                values.category = values.category.map(function(val){ 
                  return val.label; 
                })

                values.owner_id = JSON.parse(Cookies.get('user').substring(2)).id
                

                let triggerStoreDisplay = this.triggerStoreDisplay

                fetch('http://localhost:8081/addStore' , {
                  method: "POST",
                  headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(values)
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
                .then(async data => {
                  if(data){
                    // console.log(data)
                    // let prefix = 'stores/' + data.id + '/images/'
                    // await uploadHandler(prefix, this.state.selectedFiles)
                    triggerStoreDisplay(data)
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
                setFieldValue
                }) => (
                  <Form className="formBody rounded">
                    <h3>Store Sign Up</h3>

                    <Form.Group controlId="formName">
                      <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FaShoppingCart/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                          type="text" 
                          name="name"
                          value={values.name} 
                          placeholder="Business Name" 
                          onChange={handleChange} 
                          onBlur={handleBlur}
                          className={touched.name && errors.name ? "error" : null}/>
                      </InputGroup>
                      {touched.name && errors.name ? (
                        <div className="error-message">{errors.name}</div>
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
                          as="textarea" 
                          rows={3}
                          name="description"
                          value={values.description} 
                          placeholder="Description" 
                          onChange={handleChange} 
                          onBlur={handleBlur}
                          className={touched.description && errors.description ? "error" : null}/>
                      </InputGroup>
                      {touched.description && errors.description ? (
                        <div className="error-message">{errors.description}</div>
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

                    <Form.Group controlId="formStreet">
                      <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FaRoad/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="text" 
                        value={values.street}
                        placeholder="Street" 
                        name="street" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={touched.street && errors.street ? "error" : null}/>
                      </InputGroup>
                      {touched.street && errors.street ? (
                        <div className="error-message">{errors.street}</div>
                      ): null}
                    </Form.Group>

                    <Form.Group controlId="formCity">
                      <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FaBuilding/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="text" 
                          value={values.city} 
                          placeholder="City" 
                          name="city" 
                          onChange={handleChange} 
                          onBlur={handleBlur}
                          className={touched.city && errors.city ? "error" : null}/>
                      </InputGroup>
                      {touched.city && errors.city ? (
                        <div className="error-message">{errors.city}</div>
                      ): null}
                    </Form.Group>

                    <Form.Group controlId="formState">
                      <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FaUniversity/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                          value={values.state}
                          placeholder="State" 
                          name="state" 
                          onChange={handleChange} 
                          onBlur={handleBlur}
                          className={touched.state && errors.state ? "error" : null}/>
                      </InputGroup>
                      {touched.state && errors.state ? (
                        <div className="error-message">{errors.state}</div>
                      ): null}
                    </Form.Group>

                    <Form.Group controlId="formZipcode">
                      <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <FaGlobe/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control 
                          value={values.zipcode} 
                          placeholder="Zipcode" 
                          name="zipcode" 
                          onChange={handleChange} 
                          onBlur={handleBlur}
                          className={touched.zipcode && errors.zipcode ? "error" : null}/>
                      </InputGroup>
                      {touched.zipcode && errors.zipcode ? (
                        <div className="error-message">{errors.zipcode}</div>
                      ): null}
                    </Form.Group>
                    
                    <Form.Group controlId="formCategory">
                      <Select
                        value={values.category}
                        onChange={option => setFieldValue("category", option)}
                        name="category"
                        options={this.options}
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

export default StoreSignupForm;
