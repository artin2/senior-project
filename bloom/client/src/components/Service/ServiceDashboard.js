// this component is ready to be reusable for WorkerDashboard.js, if we decide that it can have the same
// view as this one... just need to rename to StoreItemDashboard.js

import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';
import './Services.css';
import eyelash from '../../assets/eyelash4.png';
import wedding from '../../assets/wedding.jpg';
import gel from '../../assets/gel.jpg';

const colors = ['#f0d1d9', '#f7e5e4', '#d6ced3'];

class ServiceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      items: [{
        id: '0',
        name: 'Eyelash Remove',
        category: 'Eyelashes',
        cost: '25',
        duration: '20',
        description: 'Remove your eyelashes or something like that',
        workers: ['Tiffany', 'Yuki'],
        pictures: [eyelash]
      },
      {
        id: '1',
        name: 'Gel Manicure',
        category: 'Nails',
        cost: '30',
        duration: '60',
        description: 'Its like a regular manicure, with gel!',
        workers: ['Tiffany', 'Yuki'],
        pictures: [gel]
      },
      {
        id: '2',
        name: 'Wedding Makeup',
        category: 'Makeup',
        cost: '200',
        duration: '120',
        description: 'Full face makeup or something for your big day',
        workers: ['Tiffany', 'Yuki'],
        pictures: [wedding]
      },
    ],
      redirectToItemEditForm: null,
      redirectToItemDisplay: null,
      itemUrl: ''
    }
  }

  triggerItemEditForm(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/" + this.state.itemUrl + "/" + id + '/edit'
    })
  }

  triggerItemDisplay(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/" + this.state.itemUrl + "/" + id
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.services){
      this.setState({
        items: this.props.location.state.services,
        itemUrl: '/services/'
      })
    }
    else if(this.props.location.state && this.props.location.state.stores){
      this.setState({
        items: this.props.location.state.stores,
        itemUrl: '/stores/'
      })
    }
    else{
      let itemUrlParsed = window.location.href.split('/').slice(-1)[0]
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + "/" + itemUrlParsed, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
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
            items: data,
            itemUrl: itemUrlParsed
          })
        }
      });
    }
  }


  render() {
    return (
      <div className="container">
      <Col>
      <p className="services_title">My Services </p>
        <Button className="buttons" onClick={() => this.triggerItemDisplay()}>Add Service</Button>
        <Button className="buttons" onClick={() => this.triggerItemEditForm()}>Edit Services</Button>
        <div className="service_container">
          {this.state.items.map((item, indx) => (
            <Col key={"item-" + item.id}>

              <div className="service_card">

              {((item.id % 2) == 0) ? (
                <div className="service_img">
                  <img src={item.pictures[0]} style={{height: '500px', width:'100%'}}/>
                </div>
              ) : null}

                <div className="service_text" style={{backgroundColor: `${colors[indx % 3]}`}}>
                  <div className="fun_style"> </div>
                  <Col>
                  <div className="title_container" style={{backgroundColor: `${colors[indx % 3]}`}}>
                    <p className="service_title"> {item.name} </p>
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
                      <p>  {item.category}  </p>
                      <p> $ {item.cost}  </p>
                      <p>  {item.duration} Minutes  </p>
                      <p> {item.workers} </p>
                      <p> {item.description} </p>
                    </div>
                  </Row>
                </Col>
                </div>

                {((item.id % 2) != 0) ? (
                  <div className="service_img">
                    <img src={item.pictures[0]} style={{height: '500px', width:'100%'}}/>
                  </div>
                ) : null}

              </div>

            </Col>
          ))}
        </div>
        </Col>
      </div>
    );
  }
}

export default ServiceDashboard;
