import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';
import LargeCarousel from '../LargeCarousel';
// import getPictures from '../s3'

class ServiceDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      service: {
        id: "",
        name: "",
        cost: "",
        workers: [],
        store_id: "",
        category: "",
        description: ""
      },
      pictures: []
    }

    // this.getPicturesAsync = this.getPicturesAsync.bind(this);
  }

  // async getPicturesAsync(){
  //   let data = await getPictures('stores/' + this.state.service.store_id + '/services/')
  //   console.log(data)
  //   this.setState({
  //     pictures: data
  //   })
  // }

  getPictures(){
    fetch('http://localhost:8081/getImages', {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({prefix: 'stores/' + this.state.service.store_id + '/services/'})
    })
    .then(function(response){
      if(response.status!==200){
        // throw an error alert
        store.dispatch(addAlert(response))
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      if(data){
        this.setState({
          pictures: data
        })
      }
    });
  }

  async componentDidMount(): Promise<void> {
    if(this.props.location.state && this.props.location.state.service){
      this.setState({
        service: this.props.location.state.service
      },
      this.getPictures)
      // this.getPicturesAsync)
    }
    else{
      const response = await fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await response.json()
      this.setState({
        service: data
      },
      this.getPictures)
      // this.getPicturesAsync)
    }

    return Promise.resolve()
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <h1>{this.state.service.name}</h1>
            <p>{this.state.service.description}</p>
          </Col>

          <Col xs={10} sm={9} md={8} lg={7}>
            <LargeCarousel className="carousel" pictures={this.state.pictures}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ServiceDisplay;