// this component is ready to be reusable for WorkerDashboard.js, if we decide that it can have the same
// view as this one... just need to rename to StoreItemDashboard.js

import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap';
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class ServiceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      items: [{
        id: ""
      }],
      redirectToItemEditForm: null,
      redirectToItemDisplay: null,
      itemUrl: ''
    }
  }

  triggerItemEditForm(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/" + this.state.itemUrl + "/" + id + '/edit'
    })
  }

  triggerItemDisplay(id) {
    this.props.history.push({
      pathname: '/stores/' + this.props.match.params.store_id + "/" + this.state.itemUrl + "/" + id
    })
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.services){
      this.setState({
        items: this.props.location.state.services,
        itemUrl: '/services/'
      })
    }
    else if(this.props.location.state && this.props.location.state.stores){
      this.setState({
        items: this.props.location.state.stores,
        itemUrl: '/stores/'
      })
    }
    else{
      let itemUrlParsed = window.location.href.split('/').slice(-1)[0]
      console.log(itemUrlParsed)
      fetch('http://localhost:8081/stores/' + this.props.match.params.store_id + "/" + itemUrlParsed, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
      })
      .then(function(response){
        console.log(response)
        if(response.status!==200){
          // throw an error alert
          store.dispatch(addAlert(response))
        }
        else{
          return response.json();
        }
      })
      .then(data => {
        if(data){
          console.log("Retrieved item data successfully!", data)
          this.setState({
            items: data,
            itemUrl: itemUrlParsed
          })
        }
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          {this.state.items.map(item => (
            <Col key={"item-" + item.id}>
              <Button onClick={() => this.triggerItemDisplay(item.id)}>Show</Button>
              <Button onClick={() => this.triggerItemEditForm(item.id)}>Edit</Button>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default ServiceDashboard;
