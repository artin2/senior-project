import React from 'react';
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap';
// import { getPictures } from '../s3'

class SearchCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: []
    }
  }

  async componentDidMount() {
    // let picturesFetched = await getPictures('stores/' + this.props.store.id + '/images/')
    // this.setState({
    //   pictures: picturesFetched
    // })

    // can put this for now so we don't have to upload to s3
    this.setState({
      pictures: [
          "/hair.jpg",
          "/nails.jpg",
          "/salon.jpg"
        ]
    })
  }
  
  render() {
    let image;
    if(this.props.carousel){
      image = <LargeCarousel pictures={this.state.pictures}/>
    }
    else{
      image = <img className="d-block w-100" src={this.state.pictures[0]} alt={"1"} />
    }

    let button
    if(!this.props.omitBookOption){
      button = <Button onClick={() => this.props.onClickFunctionBook(this.props.store.id)}>Book Now</Button>
    }

    return (
      <Card style={this.props.styleVal}>
        {image}
        <Card.Body>
          <Card.Title onClick={() => this.props.onClickFunctionStore(this.props.store.id)} style={{cursor: 'pointer'}} >{this.props.store.name}</Card.Title>
          <Card.Text>{this.props.store.description}</Card.Text>
          {button}
        </Card.Body>
      </Card>
    );
  }
}

export default SearchCard;
