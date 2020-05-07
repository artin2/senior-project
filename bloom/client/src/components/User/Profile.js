import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import ListGroup from 'react-bootstrap/ListGroup'
import './LoginForm.css'
import Calendar from '../Calendar/CalendarPage'
import EditProfileForm from './EditProfileForm';
import GridLoader from 'react-spinners/GridLoader'
import WorkerEditForm from '../Worker/WorkerEditForm';
import { css } from '@emotion/core'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

const override = css`
  display: block;
  margin: 0 auto;
`;

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: 0,
        store_id: 0,
        created_at: "",
        first_name: "",
        last_name: "",
        email: "",
        // services: []
      },
      loading: true,
      userHours: [],
      // receivedServices: [],
      selectedOption: [],
      storeHours: [],
      choice: 0,
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
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

  updateUser = (user, newHours, services) => {
    let updateHours = this.state.userHours.map((dayHours, index) =>{
      if(newHours[index] != null) {
        return newHours[index]
      } else {
        return dayHours
      }
    })
    this.setState({
      user: user,
      userHours: updateHours,
      // receivedServices: services
    })
  }

  updateContent = (selectedChoice) => {
    this.setState({
      choice: selectedChoice
    })
  };

  componentDidMount() {

    let store_id = this.props.user.store_id;
    let worker_id = this.props.user.worker_id;
    if (this.props.user && this.props.user.role == '2') {
      // let convertedServices = this.props.location.state.worker.services.map((service) => ({ value: service, label: this.state.serviceMapping[service] }));
      Promise.all([
        fetch(fetchDomain + '/stores/' + store_id + '/workers/' + worker_id + '/hours', {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        }).then(value => value.json()),
        fetch(fetchDomain + '/stores/' + store_id + "/storeHours", {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        }).then(value => value.json())
      ]).then(allResponses => {
        let receivedWorkerHours = allResponses[1].map((day) => ({ start_time: day.open_time, end_time: day.close_time }));
        if (allResponses[0] && allResponses[0].length == 7) {
          receivedWorkerHours = allResponses[0]
        } else {
          this.setState({
            newHours: receivedWorkerHours
          })
        }
        this.setState({
          user: this.props.user,
          // receivedServices: this.props.location.state.worker.services,
          storeHours: allResponses[1],
          userHours: receivedWorkerHours,
          loading: false
        })
      })
    }
    else if(this.props.user.role == '2') {
      Promise.all([
        fetch(fetchDomain + '/stores/' + store_id + '/workers/' + worker_id, {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        }).then(value => value.json()),
        fetch(fetchDomain + '/stores/' + store_id + "/storeHours", {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        }).then(value => value.json()),
        fetch(fetchDomain + '/stores/' + store_id + '/workers/' + worker_id + '/hours', {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          },
          credentials: 'include'
        }).then(value => value.json())
      ]).then(allResponses => {
        let convertedServices = allResponses[0].services.map((service) => ({ value: service, label: this.state.serviceMapping[service] }));
        let receivedWorkerHours = allResponses[1].map((day) => ({ start_time: day.open_time, end_time: day.close_time }));

        // If worker hours are not complete, we default them to store hours. Worker hours should be complete though.
        if (allResponses[2] && allResponses[2].length == 7) {
          receivedWorkerHours = allResponses[2]
        } else {
          this.setState({
            newHours: receivedWorkerHours
          })
        }
        this.setState({
          user: allResponses[0],
          // receivedServices: allResponses[0].services,
          selectedOption: convertedServices,
          storeHours: allResponses[1],
          userHours: receivedWorkerHours,
          loading: false
        })
      })
    }
    else {
      this.setState({
        loading: false,
        choice: 2
      })
    }
  }

  render() {
    const ListWorkingHours = () => {
      let items = [];
      for (let i = 0; i < this.state.userHours.length; i++) {
        if (this.state.userHours[i].start_time != null) {
          items.push(<Col sm="11" md="10" key={i}><ListGroup.Item>{this.state.daysOfWeek[i]}: {this.convertMinsToHrsMins(this.state.userHours[i].start_time)}-{this.convertMinsToHrsMins(this.state.userHours[i].end_time)}</ListGroup.Item></Col>);
        }
        else {
          items.push(<Col sm="11" md="10" key={i}><ListGroup.Item>{this.state.daysOfWeek[i]}: Off</ListGroup.Item></Col>);
        }
      }
      return items;
    }

    const RenderProfileContent = () => {
      if(this.state.choice == 0) {
        //need to make this dynamic
        return <Calendar role={"my"} store_id={this.props.user.store_id}/>
      } else if(this.state.choice == 1) {
        return <p>Past Appointments go here....</p>
      } else if(this.state.choice == 2) {
        return <EditProfileForm/>
      } else {
        return <WorkerEditForm store_id={this.props.user.store_id} worker_id={this.props.user.worker_id}/>
      }
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
      } else if(this.props.user.role == '2') {
        {/* CITATION: https://bootsnipp.com/snippets/M48pA */}
        return <Row className="justify-content-center my-4 mx-1">
        <Col xs="11" md="3" className="mb-4">
        <div className="profile-sidebar">
            {/* <!-- SIDEBAR USERPIC --> */}
            <div className="profile-userpic">
              <Image src="https://i.redd.it/v0caqchbtn741.jpg" className="img-responsive" alt="" rounded />
            </div>
            {/* <!-- END SIDEBAR USERPIC --> */}

            {/* <!-- SIDEBAR USER TITLE --> */}
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                {this.state.user.first_name + " " + this.state.user.last_name}
              </div>
              <div className="profile-usertitle-job">
                Stylist
              </div>
            </div>
            {/* <!-- END SIDEBAR USER TITLE --> */}



            {/* WORKING HOURS */}
            <ListGroup variant="flush" className="d-none d-lg-block">
              <Row className="justify-content-center mt-4">
                <h5>Working Hours</h5>
                <ListWorkingHours/>
              </Row>
            </ListGroup>
            {/* END WORKING HOURS */}

            {/* <!-- SIDEBAR MENU --> */}
            <div className="profile-usermenu">
              <Nav defaultActiveKey="link-0" className="flex-column" variant="pills">
                <Nav.Link eventKey="link-0" active={this.state.choice == 0} onClick={() => this.updateContent(0)}>Calendar</Nav.Link>
                <Nav.Link eventKey="link-1" active={this.state.choice == 1} onClick={() => this.updateContent(1)}>Past Appointments</Nav.Link>
                <Nav.Link eventKey="link-2" active={this.state.choice == 2}  onClick={() => this.updateContent(2)}>Edit Profile</Nav.Link>
                <Nav.Link eventKey="link-3" active={this.state.choice == 3}  onClick={() => this.updateContent(3)}>Edit Working Hours</Nav.Link>
              </Nav>
            </div>
            {/* <!-- END MENU --> */}

          </div>
        </Col>

        <Col xs="11" md="9">
        <div className="profile-content">
            <RenderProfileContent/>
          </div>
        </Col>

      </Row>
      }
      else {
        let type = 'Customer'
        if(this.props.user.role == '1'){
          type = 'Salon Owner'
        }
        
        return <Row className="justify-content-center my-5">
        <Col xs="11" md="3">
        <div className="profile-sidebar mb-5">
            {/* <!-- SIDEBAR USERPIC --> */}
            <div className="profile-userpic">
              <Image src="https://i.redd.it/v0caqchbtn741.jpg" className="img-responsive" alt="" rounded />
            </div>
            {/* <!-- END SIDEBAR USERPIC --> */}

            {/* <!-- SIDEBAR USER TITLE --> */}
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                {this.props.user.first_name + " " + this.props.user.last_name}
              </div>
              <div className="profile-usertitle-job">
                {type}
              </div>
            </div>
            {/* <!-- END SIDEBAR USER TITLE --> */}

            {/* <!-- SIDEBAR MENU --> */}
            <div className="profile-usermenu">
              <Nav defaultActiveKey="link-0" className="flex-column" variant="pills">
                <Nav.Link eventKey="link-0" active={this.state.choice == 2}  onClick={() => this.updateContent(2)}>Edit Profile</Nav.Link>
              </Nav>
            </div>
            {/* <!-- END MENU --> */}
          </div>
        </Col>

        <Col xs="11" md="9">
        <div className="profile-content">
            <RenderProfileContent/>
          </div>
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


const mapStateToProps = state => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps)(Profile);
