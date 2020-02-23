// import React from 'react';
// import GoogleMapReact from 'google-map-react';
// import Marker from './Marker';

// class MapContainer extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//         <div style={{ height: this.props.height, width: this.props.width }}>
//             <GoogleMapReact 
//                 bootstrapURLKeys={{
//                     key: process.env.GOOGLE_API_KEY, 
//                     language: 'en'
//                 }}
//                 defaultCenter={this.props.center}
//                 center={this.props.center}
//                 defaultZoom={this.props.zoom}
//                 onChildMouseEnter={this.onChildMouseEnter}
//                 onChildMouseLeave={this.onChildMouseLeave}
//             >
//                 <Marker 
//                   lat={this.props.center.lat}
//                   lng={this.props.center.lng}
//                   color={'Color'}
//                   title={'Marker 1'}
//                 />
//             </GoogleMapReact>
//         </div>
//     );
//   }
// }

// export default MapContainer;


import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={this.props.zoom}
        style={this.props.mapStyles}
        initialCenter={this.props.center}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Kenyatta International Convention Centre'}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);
