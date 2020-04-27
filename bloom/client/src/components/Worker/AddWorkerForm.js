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
import GridLoader from 'react-spinners/GridLoader'
import { css } from '@emotion/core'

const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

const override = css`
  display: block;
  margin: 0 auto;
`;

class AddWorkerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: 0, label: 'Brazilian Blowout' },
        { value: 1, label: 'Manicure' },
      ],
      workerHours: [],
      storeHours: [],
      weekIsWorking: [true, true, true, true, true, true, true],
      loading: true
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
    var old_start_time = 0
    var old_end_time = 0
    var newWorkerHours = []
    old_start_time = this.state.workerHours[day].start_time
    old_end_time = this.state.workerHours[day].end_time
    if (parseInt(event.target.querySelector('option').value) <= 840) {
      newWorkerHours = [
        ...this.state.workerHours.slice(0, day),
        { start_time: parseInt(event.target.value), end_time: old_end_time },
        ...this.state.workerHours.slice(day + 1)
      ]
    } else {
      newWorkerHours = [
        ...this.state.workerHours.slice(0, day),
        { start_time: old_start_time, end_time: parseInt(event.target.value) },
        ...this.state.workerHours.slice(day + 1)
      ]
    }

    this.setState({
      workerHours: newWorkerHours
    })
  };

  handleDayStatusChange = (day) => {
    var updateWeekIsWorking = [
      ...this.state.weekIsWorking.slice(0, day),
      !this.state.weekIsWorking[day],
      ...this.state.weekIsWorking.slice(day + 1)
    ]

    this.setState({
      weekIsWorking: updateWeekIsWorking
    })
  };

  // redirect to the worker display page and pass the new worker data
  triggerWorkerDisplay(returnedWorker) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + returnedWorker.id,
      state: {
        worker: returnedWorker
      }
    })
  }

  componentDidMount() {
    fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + "/storeHours", {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      },
      credentials: 'include'
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
      .then(data => {
        if (data) {
          let receivedWorkerHours = data.map((day) => ({ start_time: day.open_time, end_time: day.close_time }));
          this.setState({
            storeHours: data, 
            workerHours: receivedWorkerHours,
            loading: false
          })
        }
      });
  }

  render() {
    const CreateStartTimesForDay = (props) => {
      let items = [];
      for (let i = this.state.storeHours[props.day].open_time; i <= 840; i += 60) {
        items.push(<option key={i} value={i}>{this.convertMinsToHrsMins(i)}</option>);
      }
      return items;
    }
    const CreateEndTimesForDay = (props) => {
      let items = [];
      for (let i = 900; i <= this.state.storeHours[props.day].close_time; i += 60) {
        items.push(<option key={i} value={i}>{this.convertMinsToHrsMins(i)}</option>);
      }
      return items;
    }
    const DisplayWithLoading = (props) => {
      if (this.state.loading) {
        return <Row className="vertical-center">
          <Col>
            <GridLoader
              css={override}
              size={20}
              color={"#2196f3"}
              loading={this.state.isLoading}
            />
          </Col>
        </Row>
      } else { 
        return <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <Formik
              initialValues={{
                email: '',
                services: '',
                workerHours: []
              }}
              validationSchema={this.yupValidationSchema}
              onSubmit={(values) => {
                let store_id = this.props.match.params.store_id
                let triggerWorkerDisplay = this.triggerWorkerDisplay

                values.services = values.services.map(function (val) {
                  return val.value;
                })

                fetch(fetchDomain + '/stores/addWorker/' + store_id, {
                  method: "POST",
                  headers: {
                    'Content-type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify(values)
                })
                  .then(function (response) {
                    if (response.status !== 200) {
                      store.dispatch(addAlert(response))
                    }
                    else {
                      return response.json();
                    }
                  })
                  .then(function (data) {
                    // redirect to home page signed in
                    if (data) {
                      triggerWorkerDisplay(data)
                    }
                  })
              }}
            >
              {({ values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue }) => (
                  <Form className="formBody rounded">
                    <h3>Add Worker</h3>

                    <Form.Group controlId="formEmail">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FaEnvelope />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="email"
                          value={values.email}
                          placeholder="Email"
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={touched.email && errors.email ? "error" : null} />
                      </InputGroup>
                      {touched.email && errors.email ? (
                        <div className="error-message">{errors.email}</div>
                      ) : null}
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
                      ) : null}
                    </Form.Group>

                    {/* Later make this work with store hours*/}
                    <h4>Worker Hours</h4>

                    <Form.Group controlId="formHoursMonday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Monday</h5>
                          <Form.Check
                            type="checkbox"
                            id="monday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[0]}
                            onChange={() => this.handleDayStatusChange(0)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[0]} value={this.state.workerHours[0].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={0} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[0]} value={this.state.workerHours[0].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={0} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursTuesday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Tuesday</h5>
                          <Form.Check
                            type="checkbox"
                            id="tuesday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[1]}
                            onChange={() => this.handleDayStatusChange(1)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[1]} value={this.state.workerHours[1].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={1} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[1]} value={this.state.workerHours[1].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={1} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursWednesday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Wednesday</h5>
                          <Form.Check
                            type="checkbox"
                            id="wednesday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[2]}
                            onChange={() => this.handleDayStatusChange(2)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[2]} value={this.state.workerHours[2].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={2} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[2]} value={this.state.workerHours[2].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={2} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursThursday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Thursday</h5>
                          <Form.Check
                            type="checkbox"
                            id="thursday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[3]}
                            onChange={() => this.handleDayStatusChange(3)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[3]} value={this.state.workerHours[3].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={3} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[3]} value={this.state.workerHours[3].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={3} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursFriday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Friday</h5>
                          <Form.Check
                            type="checkbox"
                            id="friday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[4]}
                            onChange={() => this.handleDayStatusChange(4)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[4]} value={this.state.workerHours[4].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={4} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[4]} value={this.state.workerHours[4].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={4} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>

                    <Form.Group controlId="formHoursSaturday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Saturday</h5>
                          <Form.Check
                            type="checkbox"
                            id="saturday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[5]}
                            onChange={() => this.handleDayStatusChange(5)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[5]} value={this.state.workerHours[5].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={5} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[5]} value={this.state.workerHours[5].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={5} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>


                    <Form.Group controlId="formHoursSunday">
                      <Form.Row className="text-left">
                        <Col>
                          <h5>Sunday</h5>
                          <Form.Check
                            type="checkbox"
                            id="sunday-toggle"
                            label="Working Today?"
                            checked={this.state.weekIsWorking[6]}
                            onChange={() => this.handleDayStatusChange(6)}
                          />
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[6]} value={this.state.workerHours[6].start_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateStartTimesForDay day={6} />
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Control as="select" disabled={!this.state.weekIsWorking[6]} value={this.state.workerHours[6].end_time} onChange={this.handleSelectChange.bind(this)}>
                            <CreateEndTimesForDay day={6} />
                          </Form.Control>
                        </Col>
                      </Form.Row>
                    </Form.Group>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </Form>
                )}
            </Formik>
          </Col>
        </Row>
      } 
    }

    return (
      <Container fluid>
        <DisplayWithLoading/>
      </Container>
    );
  }
}

export default AddWorkerForm;
