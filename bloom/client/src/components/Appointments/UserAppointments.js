import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Card, ListGroup, Image } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { css } from '@emotion/core'
import GridLoader from 'react-spinners/GridLoader'
const override = css`
  display: block;
  margin: 0 auto;
`;
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

class AppointmentDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointment: [],
      start_time: 0,
      user_id: 0,
      end_time: 0,
      store_name_mappings: [],
      store_ids: [],
      cost: 0,
      service_name_mappings: [],
      grouped_service_ids: [],
      workers: [],
      loading: true
    }
  }

  deleteAppointment = () => {
    fetch(fetchDomain + '/appointments/delete/' + this.props.match.params.group_id, {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      },
      credentials: 'include'
    })
      .then(function (response) {
        if (response.status !== 200) {
          store.dispatch(addAlert(response))
        }
        else {
          return response.json()
        }
      })
      .then(data => {
        store.dispatch(addAlert('Deleted Appointment'))
        this.props.history.push({
          pathname: '/'
        })
      });
  }

  triggerAppointmentCancel = () => {
    confirmAlert({
      title: 'Are you sure?',
      message: 'You will be charged a cancellation fee by this store.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.deleteAppointment()
        },
        {
          label: 'No'
        }
      ]
    });
  }

  triggerAppointmentDisplay = (group_id) => {
    this.props.history.push({
      pathname: '/appointments/' + group_id
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

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('-');
}

  componentDidMount() {
    // Refactor to optimize if we were passed the appointment data from calling component
    // if (this.props.location && this.props.location.state && this.props.location.state.appointment) {
    //   this.setState({
    //     appointment: this.props.location.state.appointment,
    //     user_id: this.props.location.state.user_id,
    //     start_time: this.props.location.state.start_time,
    //     end_time: this.props.location.state.end_time,
    //     store_name: this.props.location.state.store_name,
    //     cost: this.props.location.state.cost,
    //     workers: this.props.location.state.workers,
    //     loading: false
    //   })
    // }
    // else {
      // retrieve the appointment data from the database
      fetch(fetchDomain + '/appointments/' + JSON.parse(Cookies.get('user').substring(2)).id, {
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
            if(Object.keys(data).length === 0 && data.constructor === Object) {
              this.setState({
                loading: false,
                hasAppointments: false
              })
            } else {
              this.setState({
                store_ids: data.store_ids,
                store_name_mappings: data.store_name_mappings,
                dates: data.dates,
                start_times: data.start_times, 
                end_times: data.end_times,
                costs: data.costs,
                group_ids: data.group_ids,
                service_name_mappings: data.service_name_mappings,
                grouped_service_ids: data.grouped_service_ids,
                loading: false,
                hasAppointments: true
              })
            }
            
          }
        });
    // }
  }

  render() {
    //remove these props args if not needed
    const ShowServices = (props) => {
      let listGroupItems = [];
      for (let i = 0; i < this.state.grouped_service_ids[props.index].length; i ++) {
        listGroupItems.push(<ListGroup.Item key={this.state.grouped_service_ids[props.index][i]}>{this.state.service_name_mappings.find((element) => element.id == this.state.grouped_service_ids[props.index][i]).name}</ListGroup.Item>);
      }
      return listGroupItems;
    }

    const AppointmentList = (props) => {
      let cards = [];
      for (let i = 0; i < this.state.group_ids.length; i ++) {
        cards.push(<Card style={{cursor: 'pointer'}} key={this.state.group_ids[i]}className="my-5" onClick={() => this.triggerAppointmentDisplay(this.state.group_ids[i])}>
          <Card.Header as="h4">{this.state.store_name_mappings.find((element) => element.id == this.state.store_ids[i]).name} on {this.formatDate(this.state.dates[i])}</Card.Header>
          <Card.Body>
            <Card.Text as="div">
              <Row>
                <Col>
                  {this.convertMinsToHrsMins(this.state.start_times[i])} - {this.convertMinsToHrsMins(this.state.end_times[i])} ${this.state.costs[i]}
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>Services Booked for Today</h5>
                  <ListGroup as="div" variant="flush">
                    <ShowServices index={i}/>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>);
      }
      return cards;
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
      } else if (this.state.hasAppointments) {
        let cancelButton;
        if (Cookies.get('user') && this.state.user_id == JSON.parse(Cookies.get('user').substring(2)).id) {
          cancelButton = <Button variant="danger" className="float-left" onClick={() => this.triggerAppointmentCancel()}>Cancel Appointment</Button>
        }
        return <Row className="justify-content-md-center">
          <Col lg={5}>
            <AppointmentList/>
          </Col>
        </Row>
      } else {
        return <Card>
          <Card.Header as="h4">My Appointments</Card.Header>
            <Card.Body>
              <Card.Text as="div">
                <h5>Whoops, looks like you need to book an appointment with us first. </h5>
                <Image src="https://s3.amazonaws.com/thumbnails.thecrimson.com/photos/2018/11/15/001152_1334195.jpg.1500x998_q95_crop-smart_upscale.jpg"/>
              </Card.Text>
            </Card.Body>
        </Card>
      }
    }

    return (
      <Container fluid>
        <DisplayWithLoading />
      </Container>
    );
  }
}

export default withRouter(AppointmentDisplay);