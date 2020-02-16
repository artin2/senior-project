import React from 'react';
import Slider from '@material-ui/core/Slider';

class SmoothSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {val: 20};
    this.handleChange = this.handleChange.bind(this);
    this.valuetext = this.valuetext.bind(this);
  }

  handleChange(e, value) {
    this.setState({val: value});
  }

  valuetext() {
    return this.state.value
  }

  render() {
    return (
      <div>
        <Slider
          value={this.state.val}
          onChange={this.handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          getAriaValueText={this.valuetext}
        />
      </div>
    );
  }
}

export default SmoothSlider;
