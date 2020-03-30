import React from 'react';
import './Homepage.css';


class Category extends React.Component {
  render() {
    return (
      <div className="image_container" style={this.props.style}>
      <img src={this.props.img} alt="paint" className="images"

      />
      <p className="text"> {this.props.text} </p>
      </div>
    );
  }
}

export default Category;
