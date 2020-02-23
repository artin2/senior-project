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
      data: [{
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For You",
        "description": "We are easily the best in the business and if you think otherwise then you are mistaken.",
        "id": 1
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For Me",
        "description": "We are probably the best in the business and if you think otherwise then you are mistaken.",
        "id": 2
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For You",
        "description": "We are definitely the best in the business and if you think otherwise then you are mistaken.",
        "id": 3
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        "id": 4
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Test For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        "id":5
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
          {this.state.data.map(vendor => (
            <Col key={"vendor-" + vendor.id}>
              <SearchCard vendor={vendor}/>
            </Col>
          ))}
        </Row>
        <Row>
          <MapContainer center={this.state.center} zoom={this.state.zoom} mapStyles={this.state.mapStyles}/>
        </Row>
      </Container>
    );
  }
}

export default SearchDisplay;


// <MapContaienr center={this.state.center} zoom={this.state.zoom} height={this.state.height} width={this.state.width}/>