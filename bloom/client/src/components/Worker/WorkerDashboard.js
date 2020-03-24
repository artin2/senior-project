import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class WorkerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      workers: [0],
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

  componentDidMount() {
    console.log(this.props.match.params.store_id, this.props.location.state)
    if(this.props.location.state && this.props.location.state.workers){
      this.setState({
        workers: this.props.location.state.workers
      })
    }
    else{
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/workers', {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        console.log(response)
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
          this.setState({
            workers: data
          })
        }
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.workers.map(worker => (
            <Col key={"worker-" + worker.id}>
              <Button onClick={() => this.triggerWorkerDisplay(worker.id)}>Show Worker</Button>
              <Button onClick={() => this.triggerWorkerEditForm(worker.id)}>Edit Worker</Button>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default WorkerDashboard;