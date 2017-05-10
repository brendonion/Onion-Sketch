import React, {Component} from 'react';
const ProgressBar = require('react-progressbar.js');
const Circle = ProgressBar.Circle;

class ShapeTimer extends Component {
  constructor(props){
    super(props);
    this.state = {currentCount: 5}
  }


  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {

    const options = {
      duration: 5000,
      easing: 'easeOut',
      strokeWidth: 4,
      color: '#d30236',
      trailColor: '#E9EDF6',
      trailWidth: 1,
      svgStyle: null
    };

    const containerStyle = {
      width: '8%',
      height: '8%',
      margin: 'auto'
    };

    return (
      <div>
        <Circle
          progress={1}
          text={this.state.currentCount}
          options={options}
          initialAnimate={true}
          containerStyle={containerStyle}
          containerClassName={'.progressbar'} 
        />
      </div>
    );
  }
}

export default ShapeTimer;
