import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import './ServiceSelection.css'
import { Form, Button } from 'react-bootstrap';

class ServiceSelection extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log('event is: ', event)
    let currService = this.props.services.find(x => x.name === event.target.id)
    if (this.props.selectedServices.find(x => x.name === currService.name)) {
      this.props.updateReservation(true, currService)
    }
    else {
      this.props.updateReservation(false, currService);
    }
    // this.setState({ [event.target.id]: !this.state[event.target.id] })
  }

  render() {
    const ServiceCheckBoxes = (props) => {
      if (this.props.services) {
        const categories = this.props.categories.map((category) => {
          return <div id={category} key={category} className="pl-4">
              <h4>{category}</h4>
              {
                this.props.services.map((service) => {
                  if(service.category == category) {
                    return <div key={service.name}>
                      <Row>
                        <Col xs='8' sm='10'>
                          <Form.Check
                            custom
                            type="checkbox" 
                            id={service.name}
                            label={service.name} 
                            checked={this.props.selectedServices.find(x => x.name === service.name)}
                            onChange={this.handleChange}
                            className='formCustom'
                          />
                        </Col>
                        <Col xs='4' sm='2'>
                          <h5 className="pt-2 text-center">${service.cost.toFixed(2)}</h5>
                        </Col>
                      </Row>
                    </div>
                  }
                })
              }
            </div>
        })
        return categories
      }
      return null
    }
    return (
      <Card className='py-3'>
        <h3>Select Services</h3>
          <Row className="text-left">
            <Col>
              <ServiceCheckBoxes/>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="3">
            <Button block onClick={this.props.handleSubmit}>Next</Button>
            </Col>
          </Row>
        
      </Card>
      
    );
  }
}

export default ServiceSelection;
