import React from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

class ReservationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {first_name: '',
                  last_name: '',
                  phone: '',
                  time: 0,
                  nails: false,
                  hair: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        <h3>Select Services</h3>

        <Form.Group controlId="service">
          <Form.Label>Service</Form.Label>
          <Form.Check 
            type="radio"
            id="nails"
            label="Nails"
            onChange={this.handleChange}
          />
          <Form.Check
            type="radio"
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

export default ReservationForm;
