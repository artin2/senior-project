import React from 'react';
import LargeCarousel from '../LargeCarousel';
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row'
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
      image = <LargeCarousel img={{marginLeft: 20, height: 390, width: 380}} style={{width: 380, height: 400}} pictures={this.state.pictures}/>
    }
    else{
      image = <img src={this.state.pictures[0]} alt={"1"} />
    }

    let button
    if(!this.props.omitBookOption){
      button = <Button style={{marginTop:170, backgroundColor: '#8CAFCA', border: 0}} onClick={() => this.props.onClickFunctionBook(this.props.store.id)}>Book Now</Button>
    }

    return (
      <Card style={this.props.styleVal}>
        <Row>
        {image}
        <Card.Body style={{flexWrap: 'wrap', width: '20%'}}>
          <Card.Title onClick={() => this.props.onClickFunctionStore(this.props.store.id)} style={{cursor: 'pointer', marginTop: 30}} >{this.props.store.name}</Card.Title>
          <Card.Text style={{marginTop: 30}}>{this.props.store.description}</Card.Text>
          {button}
        </Card.Body>
        </Row>
      </Card>
    );
  }
}

export default SearchCard;
