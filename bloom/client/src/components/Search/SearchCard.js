import React from 'react';
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap';

class SearchCard extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let image;
    if(this.props.carousel){
      image = <LargeCarousel urls={this.props.store.urls}/>
    }
    else{
      image = <img className="d-block w-100" src={this.props.store.urls[0]} alt={"1"} />
    }

    return (
      <Card style={this.props.styleVal}>
        {image}
        <Card.Body>
          <Card.Title onClick={() => this.props.onClickFunctionStore(this.props.store.id)} style={{cursor: 'pointer'}} >{this.props.store.name}</Card.Title>
          <Card.Text>{this.props.store.description}</Card.Text>
          <Button onClick={() => this.props.onClickFunctionBook(this.props.store.id)}>Book Now</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default SearchCard;
