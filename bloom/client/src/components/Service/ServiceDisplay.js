import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import {
//   addAlert
// } from '../../reduxFolder/actions'
// import store from '../../reduxFolder/store';
import LargeCarousel from '../LargeCarousel';
import { getPictures } from '../s3'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

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
  }

  async componentDidMount(): Promise<void> {
    let picturesFetched = await getPictures('stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id + '/')

    // should remove when data is stable
    if(picturesFetched.length == 0){
      picturesFetched = [{ 
        url: "/hair.jpg",
        key: "/hair.jpg"
      },
      {
        url: "/nails.jpg",
        key: "/nails.jpg"
      },
      {
        url: "/salon.jpg",
        key: "/salon.jpg"
      }
    ]
    }

    // can put this for now so we don't have to upload to s3
    // let picturesFetched = [{ 
    //     url: "/hair.jpg",
    //     key: "/hair.jpg"
    //   },
    //   {
    //     url: "/nails.jpg",
    //     key: "/nails.jpg"
    //   },
    //   {
    //     url: "/salon.jpg",
    //     key: "/salon.jpg"
    //   }
    // ]

    if(this.props.location.state && this.props.location.state.service){
      
      this.setState({
        service: this.props.location.state.service,
        pictures: picturesFetched
      })
    }
    else{
      const response = await fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + '/services/' + this.props.match.params.service_id, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await response.json()
      this.setState({
        service: data,
        pictures: picturesFetched
      })
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