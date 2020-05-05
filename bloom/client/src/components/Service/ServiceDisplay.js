import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Cookies from 'js-cookie';
import { FaEdit, FaHourglassHalf, FaDollarSign } from 'react-icons/fa';
// import {
//   addAlert
// } from '../../reduxFolder/actions'
// import store from '../../reduxFolder/store';
import {Carousel, Image } from 'react-bootstrap'
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
      pictures: [],
      store: {owners:[]}
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

    let response2 = await fetch(fetchDomain + '/stores/' + this.props.match.params.store_id, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })

    const data2 = await response2.json()
    this.setState({
      store: data2
    })

    return Promise.resolve()
  }

  triggerServiceEdit() {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/services/" + this.props.match.params.service_id + '/edit',
      state: {
        service: this.state.service
      }
    })
  }

  render() {
    let editButton;
    if(Cookies.get('user') && this.state.store.owners.indexOf(JSON.parse(Cookies.get('user').substring(2)).id) > -1){
      editButton = <FaEdit className="edit mb-3" style={{marginTop: "40px"}} size={25} onClick={() => this.triggerServiceEdit()}/>
    }

    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6} className="vertical-align-contents px-0 h-100 w-100">
            <Carousel interval="">
              {this.state.pictures.map((picture, index) => (
                <Carousel.Item key={"pic-" + index}>
                  <Image fluid src={picture.url} alt={"Slide " + index} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={5}>
            <Row className={"justify-content-center"}>
              <p className="name">{this.state.service.name}</p>
              {editButton}
            </Row>
            <Row className={"justify-content-center"} style={{marginTop: "75px"}}>
              <p className="address-large">{this.state.service.description}</p>
            </Row>
            <Row className={"justify-content-center"}>
              <Col md={1}>
                <FaDollarSign/>
              </Col>
              <Col md={1}>
                <p className={"address-small"}>{this.state.service.cost}</p>
              </Col>
            </Row>
            <Row className={"justify-content-center"}>
              <Col md={1}>
                <FaHourglassHalf/>
              </Col>
              <Col md={1}>
                <p className={"address-small"}>{this.state.service.duration}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ServiceDisplay;