import React from 'react';
import './StaticPage.css';
import {Container, Col, Row} from 'react-bootstrap'
import paint from '../../assets/abstract-painting.jpg';

class StaticPage extends React.Component {
  render() {
    return (
      <Container fluid>

          <img src={paint} alt="paint" style={{top: 0, left: 0, position: 'absolute', height: '100%', width:'100%', filter: 'grayscale(0.4)'}}/>
          <Row className="justify-content-center">
            <Col xs={12} sm={11} md={10} lg={9}>
              <div className="container_about">
                <h1 className="about">~ About Us ~</h1>
                    <p style={{fontSize: 22, marginTop: '5%'}}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged. It was popularised in
                    the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                    and more recently with desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum
                    </p>
                </div>
              </Col>
            </Row>

      </Container>
    );
  }
}

export default StaticPage;
