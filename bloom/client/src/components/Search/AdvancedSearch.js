import React from 'react';
import './AdvancedSearch.css'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {street: '',
                  city: '',
                  state: '',
                  zip: '',
                  arrive: 0};
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
      state: address[6].short_name,
      zip: address[8].short_name,
    })
  }

  handleChange(event) {
    if (event.target.name) {
      this.setState({[event.target.name]: event.target.value})
    }
    else{
      this.setState({arrive: event.target.value});
    }
  }

  handleSubmit() {
      alert("Submit");
  }

  render() {
    return (
      <form className="formBody rounded">
        <h3>Book Now</h3>
        <div className="form-group">
          <label>Address</label>
          <input id="autocomplete"
            ref="input"
            type="text"
            autoComplete="new-password"
            className="form-control"/>
        </div>
        <div className="form-group">
          <label>Time</label>
          <select
            className="form-control"
            id="formSearchArrive"
            value={this.state.arrive}
            onChange={this.handleChange}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>
          Submit
        </button>
      </form>
    );
  }
}

export default AdvancedSearch;
