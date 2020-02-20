import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AdvancedSearch from '../Search/AdvancedSearch';
import './Homepage.css';

class Homepage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={8} sm={7} md={6} lg={5}>
            <AdvancedSearch/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Homepage;
