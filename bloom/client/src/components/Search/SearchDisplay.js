import React from 'react';
import Container from 'react-bootstrap/Container'
import { Form, Row} from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'
import MapContainer from '../Map/MapContainer'
import { Multiselect } from 'multiselect-react-dropdown';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { FiSearch} from 'react-icons/fi';


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
      services: ["Nail Salon", "Hair Salon",  "Facials",  "Barbershops"],
      selected: [],
    }
    this.handleChange = this.handleChange.bind(this);
  }


  handleChange (event) {

    let newArr = this.state.selected;
    newArr.push(event.target.value);
    // this.setState({
    //   selected: newArr,
    // })

   };


  componentDidMount(){
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
              lat: "34.277639",
              lng: "-118.3741806"
            }
          })
        }
      });
    }
  }

  render() {
    const { services, selected } = this.state;
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

      map = <Col style={{position: 'fixed', width: '50%', height: '100%', right: 0}}>
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

          <div style={{position: 'fixed', marginTop:75, zIndex: 5, backgroundColor: '#F0F0F0', width: '50%', height: 250, paddingTop: 40}}>
          <p className="search_title"> Search for salons... </p>

          <div style={{ marginLeft: '15%', width: '80%', display: 'flex', flexDirection: 'row'}}>
          <Form.Group controlId="autocomplete">
            <Form.Control
              type="text"
              placeholder="Try 'New Haven, CT'"
              autoComplete="new-password"
              style={{width: 500}}
            />

          </Form.Group>
          <FiSearch  size={35} style={{marginLeft: 5, paddingRight:"10px"}}/>

          </div>
          <Row>
          <Form.Control style={{marginLeft: '16.2%', width: '12%', height: 40}} as="select" id="distance" onChange={this.handleChange}>
            <option>Distance</option>
            <option>1 mile</option>
            <option>5 miles</option>
            <option>10 miles</option>
            <option>25 miles</option>
            <option>50 miles</option>
          </Form.Control>

          <Multiselect
            isObject={false}
            options={services}
            // selectedValues={this.state.selected}
            onSelect={this.onSelect}
            onRemove={this.onRemove}
            placeholder="Service"
            closeIcon="cancel"
            // displayValue="name"
            style={{multiselectContainer: {marginLeft: '2%', width: '65%'},  groupHeading:{width: 50, maxWidth: 50}, chips: { background: "#587096", height: 35 }, inputField: {color: 'black'}, searchBox: { minWidth: 250, width: '100%', height: '30', backgroundColor: 'white', borderRadius: "5px" }} }
            />
            </Row>
            </div>

        <div style={{marginLeft: 60, marginTop: 320, position: 'absolute'}}>
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
