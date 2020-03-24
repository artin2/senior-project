import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AdvancedSearch from '../Search/AdvancedSearch';
import './Homepage.css';
import {
  addAlert, addUser
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class Homepage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    // if the calling component wants us to update the navbar component
    if(this.props.location.state){
      // NOTE THIS IS NOT WORKING, NAVBAR COMPONENT DOES NOT RERENDER
      // // if the calling component set an alert, display it
      // if(this.props.location.state.user){
      //   store.dispatch(addUser(this.props.location.state.user))
      // }
      if(this.props.location.state.response){
        store.dispatch(addAlert(this.props.location.state.response))
      }
    }

  }  

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
