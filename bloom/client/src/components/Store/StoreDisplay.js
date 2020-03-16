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
        urls: [
        ],
        name: "",
        description: "",
        id: "",
        lat: "",
        lng: ""
      },
      owner: true
    }
  }

  componentDidMount() {
    let data = {
      urls: [
        "/hair.jpg",
        "/nails.jpg",
        "/salon.jpg"
      ],
      name: "Nails For You",
      description: "We are easily the best in the business and if you think otherwise then you are mistaken.",
      id: 1,
      lat: "40.740494",
      lng: "-73.999100"
    }

    // fetch('http://localhost:8081/store/' + this.props.match.params.id , {
    //   method: "GET",
    //   headers: {
    //       'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    //   })
    //   .then(function(response){
    //   if(response.status!==200){
    //       console.log("Error!", response.status)
    //       // throw new Error(response.status)
    //   }
    //   else{
    //       // redirect to home page signed in
    //       console.log("Successfully got business information!", response)
    //   }
    // })

    this.setState({
      store: data
    })
  }

  render() {
    let editButton;
    if(this.state.owner){
      editButton = <Button onClick={() =>  window.location.href='/store/' + this.state.store.id + "/edit"}>Edit Store</Button>
    }

    return (
      <Container fluid>
        <Row className="justify-content-center">
            <Col>
              <Button onClick={() =>  window.location.href='/store/edit/' + this.state.store.id}>Edit Store</Button>
              <h1>{this.state.store.name}</h1>
              <p>{this.state.store.description}</p>
            </Col>
            <Col xs={8} sm={7} md={6} lg={5}>
              <LargeCarousel urls={this.state.store.urls}/>
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