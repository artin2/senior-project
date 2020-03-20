import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LargeCarousel from '../LargeCarousel';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { withRouter } from "react-router-dom";

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
      }
    }
  }

  triggerStoreEdit() {
    this.props.history.push({
      pathname: '/stores/edit/' + this.props.match.params.store_id,
      state: this.state
    })
  }

  componentDidMount() {
    // if we were passed the store data from calling component
    if(this.props.location.state && this.props.location.state.store){
      let convertedCategory = this.props.location.state.store.category.map((str) => ({ value: str.toLowerCase(), label: str }));
      this.setState({
        store: this.props.location.state.store,
        selectedOption: convertedCategory
      })
    }
    else{
      // retrieve the store data from the database
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id , {
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
  }

  render() {
    let editButton;
    if(this.state.store.owners.indexOf(JSON.parse(Cookies.get('user').substring(2)).id) > -1){
      editButton = <Button onClick={() =>  this.triggerStoreEdit()}>Edit Store</Button>
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

export default withRouter(StoreDisplay);