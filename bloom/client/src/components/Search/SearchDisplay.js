import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'


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
        "description": "We are easily the best in the business and if you think otherwise then you are mistaken."
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Nails For Me",
        "description": "We are probably the best in the business and if you think otherwise then you are mistaken."
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For You",
        "description": "We are definitely the best in the business and if you think otherwise then you are mistaken."
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Hair For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken."
      },
      {
        "urls": [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ],
        "name": "Test For Me",
        "description": "We are maybe the best in the business and if you think otherwise then you are mistaken."
      }]
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.data.map(vendor => (
            <Col>
              <SearchCard salon={vendor}/>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default SearchDisplay;
