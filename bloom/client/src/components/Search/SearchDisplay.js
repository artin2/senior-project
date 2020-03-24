import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SearchCard from './SearchCard'
import './SearchDisplay.css'
import MapContainer from '../Map/MapContainer'

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
        width: '50%',
        height: '50%'
      }
    }
  }

  componentDidMount(){
    if(this.props.location.state && this.props.location.state.stores && this.props.location.state.center){
      console.log("here")
      this.setState({
        stores: this.props.location.state.stores,
        center: this.props.location.state.center
      })
    }
    else{
      console.log("there")
      let self = this
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
    let storeCards = null
    let map = null
    if(this.state.stores.length > 0){
      storeCards = this.state.stores.map(store => (
        <Row key={"store-" + store.id} className="justify-content-center">
          <Col>
            <SearchCard store={store} 
                        carousel={true} 
                        styleVal={{ width: '18rem' }} 
                        onClickFunctionBook={() =>  window.location.href='/book/' + store.id} 
                        onClickFunctionStore={() =>  window.location.href='/stores/' + store.id}/>
          </Col>
        </Row>
      ))

      map = <Row>
              <MapContainer google={window.google} 
                            stores={this.state.stores} 
                            center={this.state.center} 
                            zoom={this.state.zoom} 
                            mapStyles={this.state.mapStyles}/>
            </Row>
    }
    else{
      storeCards = <h1>No Results!</h1>
    }

    return (
      <Container fluid>
        {storeCards}
        {map}
      </Container>
    );
  }
}

export default SearchDisplay;