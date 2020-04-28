import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import './Worker.css'
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
      redirectToWorkerDisplay: null
    }
  }

  triggerWorkerEditForm(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + id + '/edit'
    })
  }

  triggerWorkerDisplay(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + '/workers/' + id
    })
  }

  triggerAddWorker() {
    this.props.history.push({
      pathname: '/stores/addWorker/' + this.props.match.params.store_id
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.workers){
      this.setState({
        workers: this.props.location.state.workers
      })
    }
    else{
      fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/workers', {
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
            workers: data
          })
        }
      });
    }
  }

  render() {
    let workers = null;
    if(this.state.workers.length != 0){
      workers = <div>
                  {this.state.workers.map(worker => (
                    <Col key={"worker-" + worker.id}>
                      <Button onClick={() => this.triggerWorkerDisplay(worker.id)}>Show Worker</Button>
                      <Button onClick={() => this.triggerWorkerEditForm(worker.id)}>Edit Worker</Button>
                    </Col>
                  ))}
                </div>
    }
    else{
      workers = <div>
                  <p className="noResults">No Workers!</p>
                  <Button onClick={() => this.triggerAddWorker()}>Add Worker</Button>
                </div>
    }

    return (
      <Container fluid>
        <Row className="justify-content-center">
          {workers}
        </Row>
      </Container>
    );
  }
}

export default WorkerDashboard;