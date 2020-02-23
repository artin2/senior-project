import React from 'react';
import './AdvancedSearch.css'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {street: '',
                  city: '',
                  state: '',
                  zip: '',
                  time: 0,
                  nails: false,
                  hair: false};
    this.autocomplete = null

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

  handleSubmit(event) {
    event.preventDefault();
    // form validation would go here
    // example post to DB
    // fetch('http://localhost:4000/api/users/register' , {
    //   method: "POST",
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    // })
    // .then((result) => result.json())
    // .then((info) => { console.log(info); })
    alert(JSON.stringify(this.state));
  }

  render() {
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

export default AdvancedSearch;
