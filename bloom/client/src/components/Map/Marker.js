import React from 'react';
import './Marker.css';

class Marker extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="pin"
        style={{ backgroundColor: this.props.color, cursor: 'pointer'}}
        title={this.props.title}
        />
      );
    }
  }
  
  export default Marker;