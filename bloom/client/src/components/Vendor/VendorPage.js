import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'

class VendorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      vendor : {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For You",
        "description": "We are easily the best in the business and if you think otherwise then you are mistaken."
      }
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={10} lg={8}>
            <Card>
              <LargeCarousel urls={this.state.vendor.urls}/>
              <Card.Body>
                <Card.Title>{this.state.vendor.name}</Card.Title>
                <Card.Text>{this.state.vendor.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default VendorPage;
