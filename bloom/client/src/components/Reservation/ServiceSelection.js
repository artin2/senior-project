import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import './ServiceSelection.css'
import { Form, Button } from 'react-bootstrap';

class ServiceSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: ['Nails', 'Hair', 'Makeup', 'Eyelashes', 'Eyebrows', 'Facials', 'Skin Care']
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.props.handleSubmit.bind(this);
  }

  handleChange(event) {
    let currService = this.props.services.find(x => x.name === event.target.id)
    if (this.props.selectedServices.find(x => x.name === currService.name)) {
      this.props.updateReservation(true, currService)
    }
    else {
      this.props.updateReservation(false, currService);
    }
    this.setState({ [event.target.id]: !this.state[event.target.id] })
    console.log('end of handleChange')
  }

  render() {
    let that = this;
    const ServiceCheckBoxes = (props) => {
      console.log('services are: ', props)
      if (props.services) {
        const categories = props.categories.map((category) => {
          return <div id={category} key={category}>
              <h4>{category}</h4>
              {
                props.services.map((service) => {
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
                          <h5 className="pt-2">${service.cost.toFixed(2)}</h5>
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
        <Form onSubmit={this.props.handleSubmit}>
        <h3>Select Services</h3>
        <Form.Group controlId="service">
          <Row className="text-left">
            <Col>
              <ServiceCheckBoxes categories={this.state.categories} services={this.props.services} />
            </Col>
          </Row>
        </Form.Group>
        <Button type="submit">Next</Button>
      </Form>
      </Card>
      
    );
  }
}

export default ServiceSelection;
