import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux';

class Profile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // fix later to render all users not just current one? this.props.match.params.user_id
    return (
      <Container fluid>
        <Row className="justify-content-center">
            <Col>
              <h1>{this.props.user.first_name} {this.props.user.last_name}</h1>
              <h1>{this.props.user.phone}</h1>
              <h1>{this.props.user.email}</h1>
            </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user
})

export default connect(mapStateToProps)(Profile);
