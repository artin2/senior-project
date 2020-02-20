import React from 'react';
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'

class SearchCard extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Card style={{ width: '18rem' }}>
        <LargeCarousel urls={this.props.vendor.urls}/>
        <Card.Body>
          <Card.Title>{this.props.vendor.name}</Card.Title>
          <Card.Text>{this.props.vendor.description}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default SearchCard;
