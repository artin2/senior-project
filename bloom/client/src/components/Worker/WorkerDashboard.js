import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

class StoreDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      workers: [0],
      redirectToWorkerEditForm: null,
      redirectToWorkerDisplay: null
    }
  }

  triggerWorkerEditForm(id) {
    this.setState({
      redirectToWorkerEditForm: true,
      worker_id: id
    })
  }

  triggerWorkerDisplay(id) {
    this.setState({
      redirectToWorkerDisplay: true,
      worker_id: id
    })
  }

  componentDidMount() {
    fetch('http://localhost:8081/stores/' + this.props.location.state.store_id + '/workers', {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
      console.log(response)
      if(response.status!==200){
        // should throw an error here
        console.log("Error!", response.status)
        // throw new Error(response.status)
        window.location.href='/'
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      console.log("Retrieved worker data successfully!", data)
      this.setState({
        workers: data
      })
    });
  }

  render() {
    if(this.state.redirectToWorkerEditForm){
      return <Redirect to={{
        pathname: '/stores/' + this.props.location.state.store_id + '/workers/' + this.state.worker_id + '/edit',
        state: { 
          store_id: this.props.location.state.store_id,
          worker_id: this.state.worker_id
         }
        }}
       />
    }

    if(this.state.redirectToWorkerDisplay){
      return <Redirect to={{
        pathname: '/stores/' + this.props.location.state.store_id + '/workers/' + this.state.worker_id,
        state: { 
          store_id: this.props.location.state.store_id,
          worker_id: this.state.worker_id
         }
        }}
       />
    }

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

export default StoreDashboard;