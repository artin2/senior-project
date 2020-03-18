import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';


class StoreDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      store: {
        pictures: [
        ],
        name: "",
        description: "",
        id: "",
        lat: "",
        lng: "",
        category: []
      },
      owner: true
    }
  }

  componentDidMount() {
    fetch('http://localhost:8081/stores/' + this.props.match.params.id , {
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
      console.log("Retrieve store data successfully!", data)
      let convertedCategory = data.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      this.setState({
        store: data,
        selectedOption: convertedCategory
      })
    });
  }

  render() {
    let editButton;
    if(this.state.owner){
      editButton = <Button onClick={() =>  window.location.href='/stores/edit/' + this.state.store.id}>Edit Store</Button>
    }

    return (
      <Container fluid>
        <Row className="justify-content-center">
            <Col>
              {editButton}
              <h1>{this.state.store.name}</h1>
              <p>{this.state.store.description}</p>
            </Col>
            <Col xs={8} sm={7} md={6} lg={5}>
              <LargeCarousel pictures={this.state.store.pictures}/>
            </Col>
        </Row>
        <Row>
          {/* <WorkerDisplay/> */}
        </Row>
        <Row>
          {/* <ServiceDisplay/> */}
        </Row>
      </Container>
    );
  }
}

export default StoreDisplay;