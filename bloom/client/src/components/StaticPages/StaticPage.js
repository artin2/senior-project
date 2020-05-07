import React from 'react';
import './StaticPage.css';
import {Container, Col, Row, Image} from 'react-bootstrap'
import paint from '../../assets/abstract-painting.jpg';

class StaticPage extends React.Component {
  render() {
    return (
      <Container fluid>

          <img src={paint} alt="paint" style={{top: 75, left: 0, position: 'absolute', height: '100%', width:'100%', filter: 'grayscale(0.4)'}}/>
          <img src={paint} alt="paint" style={{transform: 'scaleY(-1)', top: 680, left: 0, position: 'absolute', height: '100%', width:'100%', filter: 'grayscale(0.4)'}}/>
          <img src={paint} alt="paint" style={{top: 1290, left: 0, position: 'absolute', height: '50%', width:'100%', filter: 'grayscale(0.4)'}}/>
          <img src={paint} className={"d-block d-lg-none"} alt="paint" style={{transform: 'scaleY(-1)', top: 1600, left: 0, position: 'absolute', height: '70%', width:'100%', filter: 'grayscale(0.4)'}}/>
          <Row className="justify-content-center">
            <Col xs={12} sm={11} md={10} lg={9}>
              <div className="container_about mt-5 p-5">
                  <h1 className="about">~ About Us ~</h1>
                  <p style={{fontSize: 22, marginTop: '5%'}}>
                  Bloom is an application which beauty salon owners and users can use for 
                  booking and managing appointments. Bloom makes the entire process of 
                  booking an appointment automated, which allows the workers to focus on 
                  serving their customers. Customers can use Bloom through the web application 
                  that you can view on any device, as well as through the mobile application, 
                  making it easy to quickly schedule appointments on the go.
                  </p>

                  <h1 className="about mb-5">~ Our Team ~</h1>
                  <Row id="arthur" className="justify-content-space-around align-items-center">
                    <Col xs={12} lg={4} className="mb-4 px-0">
                      <Image fluid style={{borderRadius: '25px', height: '250px', width: '400px'}} src="/arthur.JPG"/>
                    </Col>
                    <Col xs={12} lg={8} className="mb-4">
                      <h3>CEO: Arthur Kasumyan</h3>
                      <p>Arthur Kasumyan is a humble master of JavaScript. He claims he's only okay at React.js, but look at this website? It's beautiful. Hats off to our wonderful humble and handsome CEO.</p>
                    </Col>
                  </Row>
                  <Row id="artin" className="justify-content-space-around align-items-center">
                    <Col xs={12} lg={4} className="mb-4 px-0">
                      <Image fluid style={{borderRadius: '25px', height: '250px', width: '400px'}} src="/artin.jpeg"/>
                    </Col>
                    <Col xs={12} lg={8} className="mb-4">
                      <h3>Software Engineer 0: Artin Kasumyan</h3>
                      <p>Artin Kasumyan is the reason we're not already deployed and making money.</p>
                    </Col>
                  </Row>
                  <Row id="roula" className="justify-content-space-around align-items-center">
                    <Col xs={12} lg={4} className="mb-4 px-0">
                      <Image fluid style={{borderRadius: '25px', height: '250px', width: '400px'}} src="/roula.jpeg"/>
                    </Col>
                    <Col xs={12} lg={8}>
                      <h3>CTO: Roula Sharqawe</h3>
                      <p>Cyber Security master by day, Palestinian pop star by night. </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

      </Container>
    );
  }
}

export default StaticPage;
