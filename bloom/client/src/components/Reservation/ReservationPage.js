import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ReservationForm from './ReservationForm';

class Homepage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={10} lg={9}>
            <ReservationForm/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Homepage;
