import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


class Carousel extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {street: '',
    //               city: '',
    //               state: '',
    //               zip: '',
    //               arrive: 0};
    // this.autocomplete = null
    //
    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   if (event.target.name) {
  //     this.setState({[event.target.name]: event.target.value})
  //   }
  //   else{
  //     this.setState({arrive: event.target.value});
  //   }
  // }

  handleSubmit() {
      alert("Submit");
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img className="d-block w-100" src="..." alt="First slide"/>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100" src="..." alt="Second slide"/>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100" src="..." alt="Third slide"/>
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Carousel;
