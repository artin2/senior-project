import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';


class WorkerDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      worker: {
        id: 0,
        store_id: 0,
        services: [],
        user_id: 0,
        created_at: "",
        first_name: [],
        last_name: ""
      },
      serviceMapping: {
        0: "Brazilian Blowout",
        1: "Manicure"
      }
    }
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.worker){
      this.setState({
        worker: this.props.location.state.worker
      })
    }
    else{
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/workers/' + this.props.match.params.worker_id, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
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
      .then(data => {
        if(data){
          this.setState({
            worker: data
          })
        }
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <h1>{this.state.worker.first_name}</h1>
            <p>{this.state.worker.last_name}</p>
            <ul>
                {this.state.worker.services.map((service, index) => (
                  <li key={"cat-" + index}>{this.state.serviceMapping[service]}</li>
                ))}
              </ul>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default WorkerDisplay;