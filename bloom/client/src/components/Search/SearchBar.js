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

const helper = require('./helper.js');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: '',
        lng: ''
      },
      category: helper.getCategories(),
      nails: false,
      hair: false,
      facials: false,
      barber: false,
      spa: false,
      makeup: false,
      selected: [],
      address: '',
      distance: 1,

    }

    this.autocomplete = null
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  handleSelectChange = (selectedCategory) => {
    this.setState({ selectedCategory });
  }


  onSelect(selectedList, selectedItem) {

    this.setState({
      selected: selectedList
    })

    selectedItem = selectedItem.name;

    if(selectedItem == "Nail Salon"){
      this.setState({
        nails: true
      })
    }
    else if(selectedItem == "Hair Salon"){
      this.setState({
        hair: true
      })
    }
    else if(selectedItem == "Facials"){
      this.setState({
        facials: true
      })
    }
    else if(selectedItem == "Spa & Wellness"){
      this.setState({
        spa: true
      })
    }
    else if(selectedItem == "Makeup"){
      this.setState({
        makeup: true
      })
    }
    else{
      if(selectedItem == "Barbershops"){
        this.setState({
          barber: true
        })
      }
    }
  }

  onRemove(selectedList, removedItem, event) {

    this.setState({
      selected: selectedList
    })

    removedItem = removedItem.name;

    if(removedItem == "Nail Salon"){
      this.setState({
        nails: false
      })
    }
    else if(removedItem == "Hair Salon"){
      this.setState({
        hair: false
      })
    }
    else if(removedItem == "Facials"){
      this.setState({
        facials: false
      })
    }
    else if(removedItem == "Spa & Wellness"){
      this.setState({
        spa: false
      })
    }
    else if(removedItem == "Makeup"){
      this.setState({
        makeup: false
      })
    }
    else if(removedItem == "Barbershops"){
      this.setState({
        barber: false
      })
    }
  }

  handleSubmit() {
    let queryString = require('./helper.js').queryString;
    const formState = (({ address, distance, nails, hair, spa, facials, barber, makeup }) => ({ address, distance, nails, hair, spa, facials, barber, makeup }))(this.state);
    let query = queryString(formState)
    console.log("query is: ", query)
    this.props.history.push({
      pathname: "/search",
      search: query
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
              <Multiselect
                options={this.state.category}
                avoidHighlightFirstOption={true}
                onSelect={this.onSelect}
                onRemove={this.onRemove}
                placeholder="Category"
                closeIcon="cancel"
                displayValue="name"
                style={{multiselectContainer: {marginLeft: '2%', width: '65%'},  groupHeading:{width: 50, maxWidth: 50}, chips: { background: "#587096", height: 35 }, inputField: {color: 'black'}, searchBox: { minWidth: 250, width: '100%', height: '30', backgroundColor: 'white', borderRadius: "5px" }} }
                />

              </Form.Group>
            </Col>
          </Form.Row>
        </Form>
    );
  }
}

export default withRouter(SearchBar);
