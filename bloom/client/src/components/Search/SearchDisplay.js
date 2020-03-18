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
      stores: [{
        pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        name: "Nails For You",
        description: "We are easily the best in the business and if you think otherwise then you are mistaken.",
        id: 8,
        lat: "40.740494",
        lng: "-73.999100"
      },
      {
        pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        name: "Nails For Me",
        description: "We are probably the best in the business and if you think otherwise then you are mistaken.",
        id: 9,
        lat: "40.735812",
        lng: "-73.975754"
      },
      {
        pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        name: "Hair For You",
        description: "We are definitely the best in the business and if you think otherwise then you are mistaken.",
        id: 10,
        lat: "40.7",
        lng: "-73.8"
      },
      {
        pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        name: "Hair For Me",
        description: "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        id: 11,
        lat: "40.713956",
        lng: "-73.997383"
      },
      {
        pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        name: "Test For Me",
        description: "We are maybe the best in the business and if you think otherwise then you are mistaken.",
        id:12,
        lat: "40.745436",
        lng: "-73.930435"
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
          {this.props.location.state.stores.map(store => (
            <Col key={"store-" + store.id}>
              <SearchCard store={store} 
                          carousel={true} 
                          styleVal={{ width: '18rem' }} 
                          onClickFunctionBook={() =>  window.location.href='/book/' + store.id} 
                          onClickFunctionStore={() =>  window.location.href='/stores/' + store.id}/>
            </Col>
          ))}
        </Row>
        <Row>
          <MapContainer google={window.google} 
                        stores={this.props.location.state.stores} 
                        center={this.props.location.state.center} 
                        zoom={this.state.zoom} 
                        mapStyles={this.state.mapStyles}/>
        </Row>
      </Container>
    );
  }
}

export default SearchDisplay;