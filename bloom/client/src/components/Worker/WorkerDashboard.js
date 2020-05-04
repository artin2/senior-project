import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import './Worker.css'
import { FaEdit } from 'react-icons/fa';
import './WorkerDashboard.css'
import { Image } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup'
import UserDashboardLoader from '../Store/UserStoresDashboardLoader';
import workerImage from '../../assets/worker.png'
// import {
//   addAlert
// } from '../../reduxFolder/actions'
// import store from '../../reduxFolder/store';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

class WorkerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      workers: [],
      redirectToWorkerEditForm: null,
      redirectToWorkerDisplay: null,
      loading: true,
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

  triggerWorkerEditForm(workerPassed) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + workerPassed.id + '/edit',
      state: {
        worker: workerPassed
      }
    })
  }

  triggerWorkerDisplay(workerPassed) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + workerPassed.id,
      state: {
        worker: workerPassed
      }
    })
  }

  triggerAddWorker() {
    this.props.history.push({
      pathname: '/stores/addWorker/' + this.props.match.params.store_id
    })
  }

  async componentDidMount() {
    if(this.props.location.state && this.props.location.state.workers){
      await this.setState({
        workers: this.props.location.state.workers,
      })

      if(this.state.workers.length > 0){
        for (let i = 0; i < this.state.workers.length; i++) {
          fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/workers/' + this.state.workers[i].id + '/hours', {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            credentials: 'include'
          })
          .then(function(response){
            if(response.status!==200){
              // throw an error alert
              // store.dispatch(addAlert(response))
            }
            else{
              return response.json();
            }
          })
          .then(data => {
            if(data){
              console.log("got the worker hours", data)
              var stateCopy = Object.assign({}, this.state);
              stateCopy.workers[i].workerHours = data
              this.setState(stateCopy)
            }
          });    
        }
      }

      this.setState({
        loading: false
      })
    }
    else{
      let resp = await fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/workers', {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        if(response.status!==200){
          // throw an error alert
          // store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          this.setState({
            workers: data,
          })
        }
      });

      if(this.state.workers.length > 0){
        for (let i = 0; i < this.state.workers.length; i++) {
          fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/workers/' + this.state.workers[i].id + '/hours', {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            credentials: 'include'
          })
          .then(function(response){
            if(response.status!==200){
              // throw an error alert
              // store.dispatch(addAlert(response))
            }
            else{
              return response.json();
            }
          })
          .then(data => {
            if(data){
              console.log("got the worker hours", data)
              var stateCopy = Object.assign({}, this.state);
              stateCopy.workers[i].workerHours = data
              this.setState(stateCopy)
            }
          });
        }
      }

      this.setState({
        loading: false
      })
    }
  }

  render() {
    const ListWorkingHours = (props) => {
      if(props.workerHours){
        let items = [];
        for (let i = 0; i < props.workerHours.length; i++) {
          if (props.workerHours[i].start_time != null) {
            items.push(<Col sm="11" md="10" key={i} style={{backgroundColor: "#bdcddb"}}><ListGroup.Item className={"py-1"} style={{backgroundColor: "#bdcddb"}}>{this.state.daysOfWeek[i]}: {this.convertMinsToHrsMins(props.workerHours[i].start_time)}-{this.convertMinsToHrsMins(props.workerHours[i].end_time)}</ListGroup.Item></Col>);
          }
          else {
            items.push(<Col sm="11" md="10" key={i} style={{backgroundColor: "#bdcddb"}}><ListGroup.Item className={"py-1"} style={{backgroundColor: "#bdcddb"}}>{this.state.daysOfWeek[i]}: Off</ListGroup.Item></Col>);
          }
        }
        return items;
      }
      return null
    }

    const DisplayWithLoading = (props) => {
      if (this.state.loading) {
        return <Row className="mt-5">
            <Col xs="12">
              <UserDashboardLoader/>
            </Col>
          </Row>
      } else {
        if(this.state.workers.length == 0){
          return(
            <div>
              <p className="noResults">No Workers!</p>
              <Button className="update_button" onClick={() => this.triggerAddWorker()}>Add Worker</Button>
            </div>
          )
        }
        else{
          return(
            <div>
              <p className="workers_title">My Workers </p>
              <Button className="update_button" onClick={() => this.triggerAddWorker()}>Add Worker</Button>
              <>{this.state.workers.map((worker, index) => (
                <div key={"worker" + index}>
                  <Row className="justify-content-center align-content-center my-5">
                    <Col md={4} className="vertical-align-contents">
                      {/* <Carousel className="dashboard-carousel" interval="">
                        <Carousel.Item key={"pic-" + index}> */}
                          <Image className="dashboard-carousel" fluid src={workerImage} alt={"alt-" + index}/>
                        {/* </Carousel.Item>
                      </Carousel> */}
                    </Col>
                    <Col md={4}>
                      <Row className={"justify-content-center"}>
                        <Col sm={12}>
                          <span className={"workerName"} onClick={() => this.triggerWorkerDisplay(worker)} style={{cursor: 'pointer'}}> {worker.first_name + " " + worker.last_name} </span>
                          <FaEdit className="edit mb-3" size={25} onClick={() => this.triggerWorkerEditForm(worker)}/>
                        </Col>
                      </Row>
                      <Row className={"justify-content-center"}>
                        <ListGroup variant="flush">
                          <Row className="justify-content-center mt-4">
                            <h5>Working Hours</h5>
                            <ListWorkingHours workerHours={worker.workerHours}/>
                          </Row>
                        </ListGroup>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ))}</>
            </div>
          )
        }
      }
    }
    return (
      <Container fluid>
        <DisplayWithLoading/>
      </Container>
    );
  }
}

export default WorkerDashboard;