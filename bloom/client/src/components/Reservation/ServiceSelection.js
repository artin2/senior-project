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
      storeName: 'Nails R Us',
      services: [{ id: 1, name: 'Pedicure', cost: 10.5, workers: [0, 1, 2, 3], store_id: 1, category: 'Nails', description: 'Pedicure for your toes.', pictures: ['https://www.footfiles.com/sites/mfen/files/styles/620x413/public/images/what-is-a-pedicure-what-does-a-pedicure-feel-like.png', 'https://divanailsspakennewick.com/wp-content/uploads/2019/03/Add-on-Shellac-to-Pedicure.jpg'], duration: 30 },
      { id: 2, name: 'Manicure', cost: 20.5, workers: [0, 1, 2, 3, 4, 5], store_id: 1, category: 'Nails', description: 'Manicure for your hands.', pictures: ['https://www.headlinersinc.com/wp-content/uploads/2018/01/banner-17.jpg', 'https://cdn.apsari.com/234556/uploads/b91b6610-d120-11e9-bbc2-33ad8a55bcec_800_420.png'], duration: 45 },
      { id: 3, name: 'Haircut', cost: 15.0, workers: [2, 3, 4, 5], store_id: 1, category: 'Hair', description: 'Cut your hair.', pictures: ['https://scstylecaster.files.wordpress.com/2015/04/getting-haircut.jpg?resize=960%2C540', 'https://www.matrix.com/~/media/matrix%20us%20media%20library/blogs/2019/august/hair-styling-hair-cutting-terms/hair-styling-hair-cutting-terms-and-definition.jpg'], duration: 20 },
      { id: 4, name: 'Makeup Application for the Application of Makeup', cost: 45.0, workers: [3, 4, 5], store_id: 1, category: 'Makeup', description: 'Makeup for prom or whatever.', pictures: ['https://www.saloneleganzact.com/images/0027%20lynn%20puzzo%20photography%20.jpg', 'https://salonkhouri.com/wp-content/uploads/2015/10/MUD-Makeup-101.png'], duration: 40 },
      { id: 5, name: 'Lash Lift', cost: 80.0, workers: [0, 1, 3, 4, 5], store_id: 1, category: 'Eyelashes', description: 'Lift your eyelashes.', pictures: ['https://cdn.shopify.com/s/files/1/1629/8415/products/54A486EA-B4E4-4DD2-A5A2-48AD846E5CC9.jpg?v=1552059793', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS2m_61skAO0Fk4cIE8IwnzcNZsg7HUckCZN3Yia3CKczOCJNmO'], duration: 60 },
      ],
      categories: ['Nails', 'Hair', 'Makeup', 'Eyelashes']
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.props.handleSubmit.bind(this);
  }

  handleChange(event) {
    let currService = this.state.services.find(x => x.name === event.target.id)
    if (this.props.selectedServices.find(x => x.name === currService.name)) {
      this.props.updateReservation(true, currService)
    }
    else {
      this.props.updateReservation(false, currService);
    }
    this.setState({ [event.target.id]: !this.state[event.target.id] }, () => console.log('wtf', this.state[event.target.id]))
  }

  render() {
    let that = this;
    const ServiceCheckBoxes = (props) => {
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
              <ServiceCheckBoxes categories={this.state.categories} services={this.state.services} />
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
