import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import './SearchBar.css'
import {withRouter} from 'react-router'
import { FiSearch } from 'react-icons/fi';
import Select from 'react-select'

const helper = require('./helper.js');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: '',
        lng: ''
      },
      categories: helper.getCategoriesAsPairs(),
      selectedCategory: '',
      address: '',
      distance: 15,
    }

    this.autocomplete = null
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSelectChange = (selectedCategory) => {
    this.setState({ selectedCategory });
  }

  handleSubmit() {
    let queryString = require('./helper.js').queryString;
    const formState = (({ address, distance, nails, hair, spa, facials, barber, makeup }) => ({ address, distance, nails, hair, spa, facials, barber, makeup }))(this.state);
    let query = queryString(formState)
    console.log("query is: ", query)
    console.log("address is: ", this.state.address)
    this.props.history.push({
      pathname: "/search",
      search: query,
      state: {
        address: this.state.address
      }
    });
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components.map(function(elem){
                      return elem.long_name;
                  }).join(", ");

    this.setState({
      address: address,
      center: {
        lat: addressObject.geometry.location.lat(),
        lng: addressObject.geometry.location.lng()
      }

    })
  }

  componentDidMount () {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), { })

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
    if(this.props.location.state && this.props.location.state.address) {
      console.log("exists address", this.props.location.state.address)
      this.setState({
        address: this.props.location.state.address
      })
    }
  }

  render() {
    return (
        <Form inline className="full-width">
          <Form.Row className="px-1 full-width">
            <Col xs={12} md={6} className="form-horizontal">
              <Form.Group className="full-width" controlId="autocomplete">
                <InputGroup className="not-auto">
                  <Form.Control
                    className="full-width"
                    type="text"
                    placeholder="Try 'New Haven, CT'"
                    autoComplete="new-password"
                  />
                  <InputGroup.Append>
                    <Button variant="secondary" onClick={this.handleSubmit} disabled={!this.state.address}>
                      <FiSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="full-width">
              <Select
                className="full-width"
                value={this.state.selectedCategory}
                onChange={this.handleSelectChange}
                options={this.state.categories}
              />
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>
    );
  }
}

export default withRouter(SearchBar);
