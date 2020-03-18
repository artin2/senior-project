import React from 'react';
import './AdvancedSearch.css'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {
  withRouter,
  Redirect
} from "react-router-dom";

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {street: '',
                  city: '',
                  state: '',
                  zip: '',
                  time: 0,
                  distance: 0,
                  nails: false,
                  hair: false,
                  redirect: false};
    this.autocomplete = null
    this.redirect = false

    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.queryString = this.queryString.bind(this);
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
      zip: address[7].short_name,
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

  queryString(query) {
    // get array of key value pairs ([[k1, v1], [k2, v2]])
    const qs = Object.entries(query)
      // filter pairs with undefined value
      .filter(pair => pair[1] !== undefined)
      // encode keys and values, remove the value if it is null, but leave the key
      .map(pair => pair.filter(i => i !== null).map(encodeURIComponent).join('='))
      .join('&');
  
    return qs && '?' + qs;
  }

  handleSubmit(event) {
    // for some reason doesn't work without this..
    let query = this.queryString(this.state)
    event.preventDefault();

    fetch('http://localhost:8081/stores' + query, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
      if(response.status!==200){
        // should throw an error here
        console.log("Error!", response.status)
        // throw new Error(response.status)
        window.location.href='/'
      }
      else{
        // console.log(response)
        return response.json();
      }
    })
    .then(data => {
      console.log("Retrieved store data successfully!")
      
      // have to pass center at the end based on the forms input
      let searchCenter = {
        lat: "34.277639",
        lng: "-118.3741806"
      }

      this.setState({
        stores: data,
        redirect: true,
        center: searchCenter
      })
    });
  }

  render() {
    const redirect = this.state.redirect;
    if (redirect === true) {
      return <Redirect to={{
              pathname: '/search',
              state: { 
                stores: this.state.stores,
                center: this.state.center
               }
              }}
             />
    }
    
    return (
      <Form className="formBody rounded" onSubmit={this.handleSubmit}>
        <h3>Book Now</h3>
        <Form.Group controlId="autocomplete">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Try 'New Haven, CT'"
            autoComplete="new-password"
          />
        </Form.Group>
    
        <Form.Group>
          <Form.Label>Time</Form.Label>
          <Form.Control as="select" id="time" onChange={this.handleChange}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Distance</Form.Label>
          <Form.Control as="select" id="distance" onChange={this.handleChange}>
            <option>1 mile</option>
            <option>5 miles</option>
            <option>10 miles</option>
            <option>25 miles</option>
            <option>50 miles</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="service">
          <Form.Label>Service</Form.Label>
          <Form.Check 
            id="nails"
            label="Nails"
            onChange={this.handleChange}
          />
          <Form.Check 
            id="hair"
            label="Hair"
            onChange={this.handleChange}
          />
        </Form.Group>
          <Button type="submit">Submit</Button>
      </Form>
    );
  }
}

export default withRouter(AdvancedSearch);
