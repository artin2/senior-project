import React from 'react';
import Container from 'react-bootstrap/Container'
import { Form, Row, InputGroup, Button, Navbar } from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import './SearchBar.css'
import { Multiselect } from 'multiselect-react-dropdown';
import {withRouter} from 'react-router'
// import Chip from '@material-ui/core/Chip';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import Input from '@material-ui/core/Input';
import { FiSearch } from 'react-icons/fi';
import Select from 'react-select'
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [{value: "Nail Salon", label: "Nail Salon"},
      {value: "Hair Salon", label: "Hair Salon"}, 
      {value: "Facials", label: "Facials"}, 
      {value: "Barbershops", label: "Barbershops"}],
      selectedCategory: '',
      address: '',
      distance: 1,
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
    const formState = (({ address, distance, nails, hair }) => ({ address, distance, nails, hair }))(this.state);
    let query = queryString(formState)
    console.log("query is: ", query)
    this.props.history.push({
      pathname: "/search",
      search: query
    });
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace()
    let address = addressObject.address_components.map(function (elem) {
      return elem.long_name;
    }).join(", ");

    this.setState({
      address: address
    })
  }

  componentDidMount () {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), { })

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
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
                    <Button variant="secondary" onClick={this.handleSubmit} disabled={!this.state.address || this.state.selected == ''}>
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
