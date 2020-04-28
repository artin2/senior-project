import React from 'react';
import Container from 'react-bootstrap/Container'
import { Form, Row} from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'
import MapContainer from '../Map/MapContainer'
import { Multiselect } from 'multiselect-react-dropdown';
// import Chip from '@material-ui/core/Chip';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import Input from '@material-ui/core/Input';
import { FiSearch} from 'react-icons/fi';
const fetchDomain = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FETCH_DOMAIN_PROD : process.env.REACT_APP_FETCH_DOMAIN_DEV;


class SearchDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      stores: [],
      center: {
        lat: 0.0,
        lng: 0.0
      },
      zoom: 12,
      mapStyles: {
        width: '100%',
        height: '100%'
      },
      center: {
        lat: '',
        lng: ''
      },
      category: ["Nail Salon", "Hair Salon",  "Facials",  "Barbershops"],
      selected: [],
      address: '',
      distance: 1,
      nails: false,
      hair: false,
      facials: false,
      barber: false
    }

    this.autocomplete = null
    
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSelect(selectedList, selectedItem) {
    console.log(this.state.selected)
    this.setState({
      selected: selectedList
    })

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
    else{
      this.setState({
        barber: true
      })
    }
  }
 
  onRemove(selectedList, removedItem) {
    console.log(this.state.selected)
    this.setState({
      selected: selectedList
    })
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
    else{
      this.setState({
        barber: false
      })
    }
  }

  handleChange (event) {
    // let newArr = this.state.selected;
    // newArr.push(event.target.value);
    // // this.setState({
    // //   selected: newArr,
    // // })

    this.setState({[event.target.id]: parseInt(event.target.value) || event.target.value});
  };

  componentDidMount(){
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), { })

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect)

    if(this.props.location.state && this.props.location.state.stores && this.props.location.state.center){
      this.setState({
        stores: this.props.location.state.stores,
        center: this.props.location.state.center
      })
    }
    else{
      let link = window.location.href.split("search")
      let query = ""

      if(link.length > 1){
        query = link[1]
      }

      this.getResults(query);
    }
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

  handleSubmit(){
    let queryString = require('./helper.js').queryString;
    const formState = (({ address, distance, nails, hair }) => ({ address, distance, nails, hair }))(this.state);
    let query = queryString(formState)
    this.getResults(query)
  }

  getResults(query) {
    fetch(fetchDomain + '/stores' + query, {
      method: "GET",
      headers: {
          'Content-type': 'application/json'
      },
      credentials: 'include'
    })
    .then(function(response){
      if(response.status!==200){
        // should throw an error here
        console.log("ERROR!")
      }
      else{
        return response.json();
      }
    })
    .then(data => {
      if(data){
        this.setState({
          stores: data,
          center: {
            lat: data[0].lat,
            lng: data[0].lng
          }
        })
      }
    });
  }

  render() {
    const { category } = this.state;
    let storeCards = null
    let map = null
    if(this.state.stores.length > 0){
      storeCards = this.state.stores.map(store => (
        <Row key={"store-" + store.id} style={{width: '100%', height: 400, marginBottom: 10}}>
            <SearchCard store={store}
                        carousel={true}
                        styleVal={{ width: '100%', height: '100%'}}
                        onClickFunctionBook={() =>  window.location.href='/book/' + store.id}
                        onClickFunctionStore={() =>  window.location.href='/stores/' + store.id}

                        />

        </Row>
      ))

      map = <Col style={{position: 'fixed', width: '50%', height: '100%', right: 0, marginTop:-10}}>
              <MapContainer google={window.google}
                            stores={this.state.stores}
                            center={this.state.center}
                            zoom={this.state.zoom}
                            mapStyles={this.state.mapStyles}/>
            </Col>
    }
    else{
      storeCards = <h1>No Results!</h1>
    }

    return (

      <Container fluid>
        <Row>
          <div style={{position: 'fixed', marginTop:0, zIndex: 5, backgroundColor: '#F0F0F0', width: '51.25%', height: 230, paddingTop: 40}}>
            <p className="search_title"> Search for salons... </p>

            <div style={{ marginLeft: '15%', width: '100%', display: 'flex', flexDirection: 'row'}}>
              <Form.Group controlId="autocomplete">
                <Form.Control
                  type="text"
                  placeholder="Try 'New Haven, CT'"
                  autoComplete="new-password"
                  style={{width: 500}}
                />

              </Form.Group>
              <button className="btn btn-link" style={{paddingRight: "2px", paddingBottom:"20px"}} onClick={this.handleSubmit} disabled={!this.state.address || this.state.selected.length == 0}>
                <FiSearch/>
              </button>
              {/* <Button  size={35} style={{marginLeft: 5, paddingRight:"10px", cursor: "pointer"}} onClick={this.handleSubmit} disabled={!this.state.address}/> */}
            </div>
            <Row>
              <Form.Control style={{marginLeft: '16.2%', width: '12%', height: 40}} as="select" id="distance" onChange={this.handleChange}>
                <option>1 mile</option>
                <option>5 miles</option>
                <option>10 miles</option>
                <option>25 miles</option>
                <option>50 miles</option>
              </Form.Control>

              <Multiselect
                isObject={false}
                options={category}
                // selectedValues={this.state.selected}
                onSelect={this.onSelect}
                onRemove={this.onRemove}
                placeholder="Category"
                closeIcon="cancel"
                // displayValue="name"
                style={{multiselectContainer: {marginLeft: '2%', width: '65%'},  groupHeading:{width: 50, maxWidth: 50}, chips: { background: "#587096", height: 35 }, inputField: {color: 'black'}, searchBox: { minWidth: 250, width: '100%', height: '30', backgroundColor: 'white', borderRadius: "5px" }} }
                />
            </Row>
          </div>

          <div style={{marginLeft: 15, marginTop: 280, position: 'absolute'}}>
            <p style={{fontSize: 16, marginLeft: '-80%'}}> {this.state.stores.length} results found. </p>
            {storeCards}
          </div>
          {map}
        </Row>
      </Container>

    );
  }
}

export default SearchDisplay;
