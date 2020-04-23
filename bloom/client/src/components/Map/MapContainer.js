import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import SearchCard from '../Search/SearchCard';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      activeMarkerIndex: -1
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  displayMarkers() { 
    return this.props.stores.map((store, index) => { 
      return <Marker key={"store-" + index} id={index} position={{ 
                     lat: store.lat, 
                     lng: store.lng }} 
                     onClick={this.onMarkerClick}
                     name={store.name} /> 
    }) 
  } 

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,
    activeMarkerIndex: marker.id
  });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  onClickFunction (id) {
    console.log("Here1")
    // Currently not working...
    // window.location.href='/book/' + id
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps != this.props){
      // console.log("BEFORE", prevProps, "AFTER", this.props)
      // for some reason, center is not updating, the value changes but visually it does not
    }
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={this.props.zoom}
        style={this.props.mapStyles}
        initialCenter={this.props.center}
      >
        {this.displayMarkers()}
        <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
        >
          <SearchCard store={this.props.stores[this.state.activeMarkerIndex]} styleVal={{ width: '10rem', height: '10rem' }} onClickFunction={this.onClickFunction}/>
        </InfoWindow>
      </Map>
    );
  }
}

export default MapContainer;


// for fixing clicking within infowindow, some resources: https://stackoverflow.com/questions/60426907/reactjs-onclick-not-triggered-on-click-of-button-inside-google-maps-marker-inf
// https://github.com/fullstackreact/google-maps-react/issues/70
// https://www.google.com/search?q=onclick+within+infowindow+not+working+react&rlz=1C5CHFA_enUS821US821&oq=onclick+within+infowindow+not+working+react&aqs=chrome..69i57.7600j0j7&sourceid=chrome&ie=UTF-8