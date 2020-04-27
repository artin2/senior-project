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
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
import { uploadHandler } from '../s3';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

class StoreSignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: null,
      storeHours: [{ open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 },
      { open_time: 540, close_time: 1020 }],
    }

    // options for store categories
    this.options = [
      { value: 'nails', label: 'Nails' },
      { value: 'hair', label: 'Hair' },
      { value: 'makeup', label: 'Makeup' },
      { value: 'eyelashes', label: 'Eyelashes' },
      { value: 'eyelash extensions', label: 'Eyelash Extensions' },
      { value: 'eyebrows', label: 'Eyebrows' },
      { value: 'facials', label: 'Facials' },
      { value: 'skincare', label: 'Skin Care' },
      { value: 'waxing', label: 'Waxing' },
      { value: 'mens', label: 'Mens Services' }
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

  convertMinsToHrsMins(mins) {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    let am = false
    if (h == 24) {
      am = true
      h -= 12
    }
    else if (h < 12) {
      am = true
    } else if (h != 12) {
      h -= 12
    }
    h = h < 10 ? '0' + h : h;
    if (h == 0) {
      h = '12'
    }
    m = m < 10 ? '0' + m : m;
    if (am) {
      return `${h}:${m}am`;
    } else {
      return `${h}:${m}pm`;
    }

  }


  handleSelectChange = (event) => {
    var days = ['formHoursMonday', 'formHoursTuesday', 'formHoursWednesday', 'formHoursThursday', 'formHoursFriday', 'formHoursSaturday', 'formHoursSunday']
    var day = days.indexOf(event.target.id)
    var newStoreHours = []

    if (event.target.querySelector('option').value == "0") {
      newStoreHours = [
        ...this.state.storeHours.slice(0, day),
        { open_time: parseInt(event.target.value), close_time: this.state.storeHours[day].close_time },
        ...this.state.storeHours.slice(day + 1)
      ]
    } else {
      newStoreHours = [
        ...this.state.storeHours.slice(0, day),
        { open_time: this.state.storeHours[day].open_time, close_time: parseInt(event.target.value) },
        ...this.state.storeHours.slice(day + 1)
      ]
    }

    this.setState({
      storeHours: newStoreHours
    })
  };

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
                values.category = values.category.map(function (val) {
                  return val.label;
                })

                values.owner_id = JSON.parse(Cookies.get('user').substring(2)).id
                values.storeHours = this.state.storeHours


                let triggerStoreDisplay = this.triggerStoreDisplay

                fetch(fetchDomain + '/addStore', {
                  method: "POST",
                  headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(values)
                })
                  .then(function (response) {
                    if (response.status !== 200) {
                      // throw an error alert
                      store.dispatch(addAlert(response))
                    }
                    else {
                      return response.json();
                    }
                  })
                  .then(async data => {
                    if (data) {
                      let prefix = 'stores/' + data.id + '/images/'
                      if (this.state.selectedFiles) {
                        await uploadHandler(prefix, this.state.selectedFiles)
                      }
                      triggerStoreDisplay(data)
                    }
                  });
              }}
            >
              {({ values,
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
                            <FaShoppingCart />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          name="name"
                          value={values.name}
                          placeholder="Business Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.name && errors.name ? "error" : null} />
                      </InputGroup>
                      {touched.name && errors.name ? (
                        <div className="error-message">{errors.name}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaPen />
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
                          className={touched.description && errors.description ? "error" : null} />
                      </InputGroup>
                      {touched.description && errors.description ? (
                        <div className="error-message">{errors.description}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaPhone />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="text"
                          value={values.phone}
                          placeholder="Phone Number"
                          name="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.phone && errors.phone ? "error" : null} />
                      </InputGroup>
                      {touched.phone && errors.phone ? (
                        <div className="error-message">{errors.phone}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formStreet">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaRoad />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="text"
                          value={values.street}
                          placeholder="Street"
                          name="street"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.street && errors.street ? "error" : null} />
                      </InputGroup>
                      {touched.street && errors.street ? (
                        <div className="error-message">{errors.street}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formCity">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaBuilding />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="text"
                          value={values.city}
                          placeholder="City"
                          name="city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.city && errors.city ? "error" : null} />
                      </InputGroup>
                      {touched.city && errors.city ? (
                        <div className="error-message">{errors.city}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formState">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaUniversity />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          value={values.state}
                          placeholder="State"
                          name="state"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.state && errors.state ? "error" : null} />
                      </InputGroup>
                      {touched.state && errors.state ? (
                        <div className="error-message">{errors.state}</div>
                      ) : null}
                    </Form.Group>

                    <Form.Group controlId="formZipcode">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaGlobe />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          value={values.zipcode}
                          placeholder="Zipcode"
                          name="zipcode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.zipcode && errors.zipcode ? "error" : null} />
                      </InputGroup>
                      {touched.zipcode && errors.zipcode ? (
                        <div className="error-message">{errors.zipcode}</div>
                      ) : null}
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
                      ) : null}
                    </Form.Group>

                    <h4>Store Hours</h4>

                    <Form.Group controlId="formHoursMonday">
                      <h5 className="text-left">Monday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[0].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[0].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursTuesday">
                      <h5 className="text-left">Tuesday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[1].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[1].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursWednesday">
                      <h5 className="text-left">Wednesday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[2].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[2].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursThursday">
                      <h5 className="text-left">Thursday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[3].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[3].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursFriday">
                      <h5 className="text-left">Friday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[4].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[4].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursSaturday">
                      <h5 className="text-left">Saturday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[5].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[5].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursSunday">
                      <h5 className="text-left">Sunday</h5>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[6].open_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={0}>{this.convertMinsToHrsMins(0)}</option>
                            <option value={60}>{this.convertMinsToHrsMins(60)}</option>
                            <option value={120}>{this.convertMinsToHrsMins(120)}</option>
                            <option value={180}>{this.convertMinsToHrsMins(180)}</option>
                            <option value={240}>{this.convertMinsToHrsMins(240)}</option>
                            <option value={300}>{this.convertMinsToHrsMins(300)}</option>
                            <option value={360}>{this.convertMinsToHrsMins(360)}</option>
                            <option value={420}>{this.convertMinsToHrsMins(420)}</option>
                            <option value={480}>{this.convertMinsToHrsMins(480)}</option>
                            <option value={540}>{this.convertMinsToHrsMins(540)}</option>
                            <option value={600}>{this.convertMinsToHrsMins(600)}</option>
                            <option value={660}>{this.convertMinsToHrsMins(660)}</option>
                            <option value={720}>{this.convertMinsToHrsMins(720)}</option>
                            <option value={780}>{this.convertMinsToHrsMins(780)}</option>
                            <option value={840}>{this.convertMinsToHrsMins(840)}</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" value={this.state.storeHours[6].close_time} onChange={this.handleSelectChange.bind(this)}>
                            <option value={900}>{this.convertMinsToHrsMins(900)}</option>
                            <option value={960}>{this.convertMinsToHrsMins(960)}</option>
                            <option value={1020}>{this.convertMinsToHrsMins(1020)}</option>
                            <option value={1080}>{this.convertMinsToHrsMins(1080)}</option>
                            <option value={1140}>{this.convertMinsToHrsMins(1140)}</option>
                            <option value={1200}>{this.convertMinsToHrsMins(1200)}</option>
                            <option value={1260}>{this.convertMinsToHrsMins(1260)}</option>
                            <option value={1320}>{this.convertMinsToHrsMins(1320)}</option>
                            <option value={1380}>{this.convertMinsToHrsMins(1380)}</option>
                            <option value={1440}>{this.convertMinsToHrsMins(1440)}</option>
                          </Form.Control>
                        </Col>
                      </Form.Row>
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
                      ) : null}
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
