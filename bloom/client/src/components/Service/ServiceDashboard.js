// this component is ready to be reusable for WorkerDashboard.js, if we decide that it can have the same
// view as this one... just need to rename to StoreserviceDashboard.js

import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
// import {
//   addAlert
// } from '../../reduxFolder/actions'
// import store from '../../reduxFolder/store';
import './Services.css';
// import eyelash from '../../assets/eyelash4.png';
// import wedding from '../../assets/wedding.jpg';
// import gel from '../../assets/gel.jpg';
import { FaEdit } from 'react-icons/fa';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

const colors = ['#f0d1d9', '#f7e5e4', '#d6ced3'];

class ServiceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      services: [
        // {
        //   id: '0',
        //   name: 'Eyelash Remove',
        //   category: 'Eyelashes',
        //   cost: '25',
        //   duration: '20',
        //   description: 'Remove your eyelashes or something like that',
        //   workers: ['Tiffany', 'Yuki'],
        //   // pictures: [eyelash]
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

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.services){
      this.setState({
        services: this.props.location.state.services
      })
    }
    else{
      fetch(fetchDomain + '/stores/' + this.props.match.params.store_id + "/services/", {
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
      .then(data => {
        if(data){
          this.setState({
            services: data
          })
        }
      });
    }
  }

  // need to add getPictures****


  render() {
    let services = null;

    if(this.state.services.length > 0){
      services = <Col>
                    <p className="services_title">My Services </p>
                    <Button className="buttons" onClick={() => this.triggerAddService()}>Add Service</Button>
                    {/* <Button className="buttons" onClick={() => this.triggerServiceEditForm()}>Edit Services</Button> */}
                    <div className="service_container">
                      {this.state.services.map((service, indx) => (
                        <Col key={"service-" + service.id}>

                          <div className="service_card">

                          {/* {((service.id % 2) == 0) ? (
                            <div className="service_img">
                              <img src={service.pictures[0]} style={{height: '500px', width:'100%'}}/>
                            </div>
                          ) : null} */}

                            <div className="service_text" style={{backgroundColor: `${colors[indx % 3]}`}}>
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
                                  <p> {service.description} </p>
                                </div>
                              </Row>
                            </Col>
                            </div>

                            {/* {((service.id % 2) != 0) ? (
                              <div className="service_img">
                                <img src={service.pictures[0]} style={{height: '500px', width:'100%'}}/>
                              </div>
                            ) : null} */}

                          </div>

                        </Col>
                      ))}
                    </div>
                  </Col>
    }
    else{
      services = <div>
                  <p className="noResults">No Services!</p>
                  <Button onClick={() => this.triggerAddService()}>Add Service</Button>
                </div>
    }
    return (
      <Container>
        {services}
      </Container>
    );
  }
}

export default ServiceDashboard;
