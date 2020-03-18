import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Cookies from 'js-cookie'


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
        password_confirmation: '',
        id: this.props.match.params.id
      }
    }
  }

  componentDidMount() {
    let s = JSON.parse(Cookies.get('user').substring(2))
    console.log(s)
  
    this.setState({
      user: s
    });
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
            <Col>
              <h1>{this.state.user.first_name} {this.state.user.last_name}</h1>
              <h1>{this.state.user.phone}</h1>
              <h1>{this.state.user.email}</h1>
            </Col>
        </Row>
      </Container>
    );
  }
}

export default Profile;