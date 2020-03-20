import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class StoreDisplay extends React.Component {
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
          // should throw an error here
          console.log("Error!", response.status)
          // throw new Error(response.status)
          // window.location.href='/'
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        console.log("Retrieved worker data successfully!", data)
        this.setState({
          worker: data[0]
        })
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
          </Col>
        </Row>
      </Container>
    );
  }
}

export default StoreDisplay;