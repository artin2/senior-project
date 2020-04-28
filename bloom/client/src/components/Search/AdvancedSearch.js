import React from 'react';
import './AdvancedSearch.css'
import { Form, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { withRouter } from "react-router-dom";
import {
  addAlert
} from '../../reduxFolder/actions/alert'
import store from '../../reduxFolder/store';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
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
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), { })

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components.map(function(elem){
                      return elem.long_name;
                  }).join(", ");

    this.setState({
      address: address
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
    const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;
    console.log("environment is: ", process.env.NODE_ENV)
    console.log("fetch prod is: ", process.env.REACT_APP_FETCH_DOMAIN_PROD)
    console.log("fetch dev is: ", process.env.REACT_APP_FETCH_DOMAIN_DEV)
    console.log("fetch domain is: ", fetchDomain)
    fetch(fetchDomain + '/stores' + query, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      }
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

        <Form.Group controlId="category">
          <Row>
          <Form.Label>Category</Form.Label>
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
