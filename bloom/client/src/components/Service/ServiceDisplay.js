import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class ServiceDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      service: {
        id: "",
        name: "",
        cost: "",
        workers: [],
        store_id: "",
        category: "",
        description: ""
      }
    }
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.service){
      this.setState({
        service: this.props.location.state.service
      })
    }
    else{
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id, {
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
        console.log("Retrieved service data successfully!", data)
        this.setState({
          service: data
        })
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <h1>{this.state.service.name}</h1>
            <p>{this.state.service.description}</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ServiceDisplay;