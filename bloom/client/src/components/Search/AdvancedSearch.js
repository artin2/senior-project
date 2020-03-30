import React from 'react';
import './AdvancedSearch.css'
import { Form, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions'
import store from '../../reduxFolder/store';

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {street: '',
                  city: '',
                  state: '',
                  zipcode: '',
                  time: 1,
                  distance: 1,
                  nails: false,
                  hair: false,
                  redirect: false};
    this.autocomplete = null
    this.redirect = false

    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components
    this.setState({
      street: `${address[0].long_name} ${address[1].long_name}`,
      city: address[4].long_name,
      state: address[5].short_name,
      zipcode: address[7].short_name,
    })
  }

  handleChange(event) {
    if (event.target.type === "checkbox") {
      this.setState({[event.target.id]: !this.state[event.target.id]})
    }
    else{
      this.setState({[event.target.id]: parseInt(event.target.value) || event.target.value});
    }
  }

  handleSubmit(event) {
    // for some reason doesn't work without this..
    event.preventDefault();

    let queryString = require('./helper.js').queryString;
    let query = queryString(this.state)

    fetch('http://localhost:8081/stores' + query, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
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
        let stateRep = this.state
        stateRep.stores = data
        stateRep.redirect = true
        stateRep.center = {
          lat: "34.277639",
          lng: "-118.3741806"
        }

        this.props.history.push({
          pathname: '/search',
          search: query,
          state: stateRep
        })
      }
    });
  }

  render() {
    return (
      <div className="book_window">
      <Form className="formBody rounded" onSubmit={this.handleSubmit}>
        <h3>Book Now</h3>
        <Form.Group controlId="autocomplete">
        <Row>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Try 'New Haven, CT'"
            autoComplete="new-password"
          />
        </Row>
        </Form.Group>

        <Form.Group>
          <Row>
          <Form.Label>Time</Form.Label>
          <Form.Control as="select" id="time" onChange={this.handleChange}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
          <Form.Label>Distance</Form.Label>
          <Form.Control as="select" id="distance" onChange={this.handleChange}>
            <option>1 mile</option>
            <option>5 miles</option>
            <option>10 miles</option>
            <option>25 miles</option>
            <option>50 miles</option>
          </Form.Control>
          </Row>
        </Form.Group>

        <Form.Group controlId="service">
          <Row>
          <Form.Label>Service</Form.Label>
          <Form.Check
            style={{marginLeft: 30}}
            id="nails"
            label="Nails"
            onChange={this.handleChange}
          />
          <Form.Check
            style={{marginLeft: 10}}
            id="hair"
            label="Hair"
            onChange={this.handleChange}
          />
          </Row>
        </Form.Group>
          <Button style={{backgroundColor: '#8CAFCB', border: '0px'}} type="submit">Submit</Button>
      </Form>
      </div>
    );
  }
}

export default withRouter(AdvancedSearch);
