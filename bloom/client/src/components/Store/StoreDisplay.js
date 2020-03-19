import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';


class StoreDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      store: {
        id: "",
        name: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        created_at: "",
        category: [],
        services: [],
        workers: [],
        pictures: [],
        owners: [],
        phone: "",
        clients: [],
        description: "",
        lat: "",
        lng: ""
      },
      user_id: -1
    }
  }

  componentDidMount() {
    this.setState({
      user_id: JSON.parse(Cookies.get('user').substring(2)).id
    })

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
    if(this.state.store.owners.indexOf(this.state.user_id) > -1){
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