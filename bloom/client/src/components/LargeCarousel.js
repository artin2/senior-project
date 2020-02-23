import React from 'react';
import Carousel from 'react-bootstrap/Carousel'


class LargeCarousel extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Carousel interval="">
        {this.props.urls.map((url, index) => (
          <Carousel.Item key={"pic-" + index}>
            <img className="d-block w-100" src={url} alt={"Slide " + index} />
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
}

export default LargeCarousel;
