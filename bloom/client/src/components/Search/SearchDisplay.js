import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'
import MapContainer from '../Map/MapContainer'


class SearchDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      vendors: [{
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For You",
        "description": "We are easily the best in the business and if you think otherwise then you are mistaken.",
        "id": 1,
        "lat": "40.740494",
        "lng": "-73.999100"
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For Me",
        "description": "We are probably the best in the business and if you think otherwise then you are mistaken.",
        "id": 2,
        "lat": "40.735812",
        "lng": "-73.975754"
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For You",
        "description": "We are definitely the best in the business and if you think otherwise then you are mistaken.",
        "id": 3,
        "lat": "40.7",
        "lng": "-73.8"
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        "id": 4,
        "lat": "40.713956",
        "lng": "-73.997383"
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Test For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        "id":5,
        "lat": "40.745436",
        "lng": "-73.930435"
      }],
      center: {lat: 40.73, lng: -73.93},
      zoom: 12,
      mapStyles: {
        width: '50%',
        height: '50%'
      }
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.vendors.map(vendor => (
            <Col key={"vendor-" + vendor.id}>
              <SearchCard vendor={vendor} carousel={true} styleVal={{ width: '18rem' }}/>
            </Col>
          ))}
        </Row>
        <Row>
          <MapContainer google={window.google} vendors={this.state.vendors} center={this.state.center} zoom={this.state.zoom} mapStyles={this.state.mapStyles}/>
        </Row>
      </Container>
    );
  }
}

export default SearchDisplay;