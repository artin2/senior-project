// this component is ready to be reusable for WorkerDashboard.js, if we decide that it can have the same
// view as this one... just need to rename to StoreserviceDashboard.js

import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Carousel, Image } from 'react-bootstrap';
// import {
//   addAlert
// } from '../../reduxFolder/actions'
// import store from '../../reduxFolder/store';
import './Services.css';
// import eyelash from '../../assets/eyelash4.png';
// import wedding from '../../assets/wedding.jpg';
// import gel from '../../assets/gel.jpg';
import { getPictures, defaultServicePictures } from '../s3'
import { FaEdit } from 'react-icons/fa';
import LinesEllipsis from 'react-lines-ellipsis'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

const colors = ['#d2d4cf', '#d2d4cf', '#d2d4cf'];

class ServiceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      loading: true,
      services: [
        // {
        //   id: '0',
        //   name: 'Eyelash Remove',
        //   category: 'Eyelashes',
        //   cost: '25',
        //   duration: '20',
        //   description: 'Remove your eyelashes or something like that',
        //   workers: ['Tiffany', 'Yuki'],
        //   pictures: ["test"]
        // },
        // {
        //   id: '1',
        //   name: 'Gel Manicure',
        //   category: 'Nails',
        //   cost: '30',
        //   duration: '60',
        //   description: 'Its like a regular manicure, with gel!',
        //   workers: ['Tiffany', 'Yuki'],
        //   // pictures: [gel]
        // },
        // {
        //   id: '2',
        //   name: 'Wedding Makeup',
        //   category: 'Makeup',
        //   cost: '200',
        //   duration: '120',
        //   description: 'Full face makeup or something for your big day',
        //   workers: ['Tiffany', 'Yuki'],
        //   // pictures: [wedding]
        // },
      ]
    }
  }

  triggerServiceEdit(servicePassed) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/services/" + servicePassed.id + '/edit',
      state: {
        service: servicePassed
      }
    })
  }

  triggerServiceDisplay(servicePassed) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/services/" + servicePassed.id,
      state: {
        service: servicePassed
      }
    })
  }

  triggerAddService() {
    this.props.history.push({
      pathname: '/stores/addService/' + this.props.match.params.store_id
    })
  }

  async componentDidMount() {
    let services
    if(this.props.location.state && this.props.location.state.services){
      services = this.props.location.state.services
    }
    else{
      services = await fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + "/services/", {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        if(response.status!==200){
          // throw an error alert
          // store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
    }

    if(services.length > 0){
      var appendedServices = await Promise.all(services.map(async (service): Promise<Object> => {
        try {
          let pictures = await getPictures('stores/' + service.store_id + '/services/' + service.id)
          if(pictures.length == 0){
            pictures = defaultServicePictures()
          }

          var newService = Object.assign({}, service);
          newService.pictures = pictures;
          return newService;
        } catch (e) {
          console.log("Error get service pictures!", e)
          var newService = Object.assign({}, service);
          newService.pictures = defaultServicePictures();
          return newService
        }
      }));

      this.setState({
        services: appendedServices,
        loading: false
      })
    }
    else{
      this.setState({
        loading: false
      })
    }
  }

  render() {
    let services = null;

    if(this.state.services.length > 0){
      services = <Col>
                    <p className="services_title">My Services </p>
                    <Button className="buttons" style={{backgroundColor: "#3E4E69", color: 'white'}} onClick={() => this.triggerAddService()}>Add Service</Button>
                    {/* <Button className="buttons" onClick={() => this.triggerServiceEditForm()}>Edit Services</Button> */}
                    <div className="service_container">
                      {this.state.services.map((service, indx) => (
                        <div key={"service-" + service.id}>
                          <Row>
                              <Col className="px-0 h-50 w-50" xs={12} lg={6}>
                                <Carousel interval="">
                                  {service.pictures.map((picture, index) => (
                                    <Carousel.Item key={"pic-" + index} style={{height: '20%'}}>
                                      <Image fluid src={picture.url} alt={"Slide " + index} />
                                    </Carousel.Item>
                                  ))}
                                </Carousel>
                              </Col>
                              <Col className="service_text" xs={12} lg={6} style={{backgroundColor: `${colors[indx % 3]}`, height: '555px'}}>
                                <div className="fun_style"> </div>
                                <Col>
                                  <div className="title_container" style={{backgroundColor: `${colors[indx % 3]}`}}>
                                    <span className="service_title" onClick={() => this.triggerServiceDisplay(service)}> {service.name} </span>
                                    <FaEdit className="edit" size={15} onClick={() => this.triggerServiceEdit(service)}/>
                                  </div>
                                  <Row>
                                    <div className="service_subtitle">
                                      <p> Category </p>
                                      <p> Cost </p>
                                      <p> Duration </p>
                                      <p> Associated Workers </p>
                                      <p> Description </p>
                                    </div>
                                    <div className="subtitle_values" >
                                      <p>  {service.category}  </p>
                                      <p> $ {service.cost}  </p>
                                      <p>  {service.duration} Minutes  </p>
                                      <p> {service.workers} </p>
                                      <LinesEllipsis
                                        text={service.description}
                                        maxLine='6'
                                        ellipsis={service.description.length > 55 ? service.description.substring(0, 55) + " ..." : service.description.substring(0) + " ..."}
                                        trimRight
                                        basedOn='words'
                                      />
                                    </div>
                                  </Row>
                                </Col>
                              </Col>
                            </Row>
                          </div>
                      ))}
                    </div>
                  </Col>
    }
    else{
      services = <div>
                  <p className="noResults">No Services!</p>
                  <Button style={{backgroundColor: "#3E4E69", color: 'white'}} onClick={() => this.triggerAddService()}>Add Service</Button>
                </div>
    }

    if(this.state.loading){
      return <h1>Loading...</h1>
    }
    else{
      return (
        <Container>
          {services}
        </Container>
      );
    }
  }
}

export default ServiceDashboard;
