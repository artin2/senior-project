// Not working for some reason..
// import React from 'react';
// import { Marker } from 'google-maps-react';

// class MarkersList extends React.Component {
//   constructor(props) {
//       super(props);
//   }

//   render() {
//     return this.props.vendors.map((vendor, index) => { 
//       return <Marker key={"vendor-" + index} id={index} position={{ 
//                      lat: vendor.lat, 
//                      lng: vendor.lng }} 
//                      onClick={this.props.onMarkerClick}
//                      name={vendor.name} /> 
//     })
//   }
  
// }

// export default MarkersList;


//Resources if I want to try again later:
// https://www.newline.co/fullstack-react/articles/how-to-write-a-google-maps-react-component/#the-map-container-component
// https://stackoverflow.com/questions/54105855/infowindow-re-rendering-whole-google-map-with-thousands-of-marker-everytime/54115081
// https://github.com/fullstackreact/google-maps-react/blob/master/README.md