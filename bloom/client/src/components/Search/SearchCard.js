import React from 'react';
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'

class SearchCard extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let image;
    if(this.props.carousel){
      image = <LargeCarousel urls={this.props.vendor.urls}/>
    }
    else{
      image = <img className="d-block w-100" src={this.props.vendor.urls[0]} alt={"Image 1"} />
    }

    return (
      <Card style={this.props.styleVal}>
        {image}
        <Card.Body onClick={event =>  window.location.href='/book/' + this.props.vendor.id} style={{cursor: 'pointer'}}>
          <Card.Title>{this.props.vendor.name}</Card.Title>
          <Card.Text>{this.props.vendor.description}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default SearchCard;
