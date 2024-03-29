import React, { Component } from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      activeMarkerIndex: 0
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  displayMarkers() { 
    if(this.props.stores && this.props.stores.length > 0) {
      return this.props.stores.map((store, index) => { 
        return <Marker key={"store-" + index} id={index} position={{ 
                       lat: store.lat, 
                       lng: store.lng }} 
                       onClick={this.onMarkerClick}
                       name={store.name} /> 
      }) 
    } else {
      return null
    }
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

  render() {
    const DisplayInfoWindowContents = (props) => {
      if(this.props.stores) {
        return <h4 className="mb-0">{this.props.stores[this.state.activeMarkerIndex].name}</h4>
      } else {
        return null
      }
    }
    
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
          <DisplayInfoWindowContents/>
        </InfoWindow>
      </Map>
    );
  }
}

export default MapContainer;


// for fixing clicking within infowindow, some resources: https://stackoverflow.com/questions/60426907/reactjs-onclick-not-triggered-on-click-of-button-inside-google-maps-marker-inf
// https://github.com/fullstackreact/google-maps-react/issues/70
// https://www.google.com/search?q=onclick+within+infowindow+not+working+react&rlz=1C5CHFA_enUS821US821&oq=onclick+within+infowindow+not+working+react&aqs=chrome..69i57.7600j0j7&sourceid=chrome&ie=UTF-8