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
    if(this.props.location.state && this.props.location.state.stores){
      this.setState({
        stores: this.props.location.state.stores
      })
    }

    if(this.props.location.state && this.props.location.state.center){
      this.setState({
        center: this.props.location.state.center
      })
    }
  }

  render() {
    let storeCards = null
    let map = null
    if(this.state.stores.length > 0){
      console.log(this.state.stores)
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