import React from 'react';
import '../../App.css';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FaShoppingCart, FaRoad, FaBuilding, FaUniversity, FaGlobe } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';


class StoreEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: {
        urls: [],
        name: "",
        description: "",
        id: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        category: []
      },
      selectedOption: null
    };
    
    this.options = [
      { value: 'nails', label: 'Nails' },
      { value: 'hair', label: 'Hair' },

    ];
   
    // Schema for yup
    this.yupValidationSchema = Yup.object().shape({
      name: Yup.string()
      .min(2, "Store name must have at least 2 characters")
      .max(100, "Store name can't be longer than 100 characters")
      .required("Name is required"),
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
      zip: Yup.string()
      .max(20, "Zip can't be longer than 100 characters")
      .required("Zip is required"),
      category: Yup.array()
      .required("Category is required")
      .nullable()
    });
  }

  // temporary, change so that we pass as prop the store data and set that as initial value to rubik
  UNSAFE_componentWillMount() {
    let data = {
      urls: [
        "/hair.jpg",
        "/nails.jpg",
        "/salon.jpg"
      ],
      name: "Nails For You",
      description: "We are easily the best in the business and if you think otherwise then you are mistaken.",
      id: 1,
      street: "11421 Clybourn Ave",
      city: "Sylmar",
      state: "CA",
      zip: "91342",
      category: ["Nails"]
    }
    let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));

    // fetch('http://localhost:8081/store/' + this.props.match.params.id , {
    //   method: "GET",
    //   headers: {
    //       'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    //   })
    //   .then(function(response){
    //   if(response.status!==200){
    //       console.log("Error!", response.status)
    //       // throw new Error(response.status)
    //   }
    //   else{
    //       // redirect to home page signed in
    //       console.log("Successfully got business information!", response)
    //   }
    // })

    this.setState({
      store: data,
      selectedOption: convertedCategory
    })
  }


  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
          <Formik 
              initialValues={{
                name: this.state.store.name,
                street: this.state.store.street,
                city: this.state.store.city,
                state: this.state.store.state,
                zip: this.state.store.zip,
                category: this.state.selectedOption
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                values.category = values.category.map(function(val){ 
                  return val.label; 
                })
                fetch('http://localhost:8081/storeEdit' , {
                  method: "PATCH",
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify(values)
                })
                .then(function(response){
                  if(response.status!==200){
                    console.log("Error!", response.status)
                    // throw new Error(response.status)
                  }
                  else{
                    // redirect to home page signed in
                    console.log("Successful edit!", response.status)
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
                <h3>Store Edit</h3>

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

                <Form.Group controlId="formZip">
                  <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <FaGlobe/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                      value={values.zip} 
                      placeholder="Zip" 
                      name="zip" 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={touched.zip && errors.zip ? "error" : null}/>
                  </InputGroup>
                  {touched.zip && errors.zip ? (
                    <div className="error-message">{errors.zip}</div>
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

export default StoreEditForm;
